import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GenerateEmbeddingDto } from './embeddings.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class EmbeddingsService {
	private readonly ollamaUrl: string = process.env.OLLAMA_URL || ''
	private readonly modelName: string = process.env.OLLAMA_MODEL || ''

	constructor(private readonly prisma: PrismaService) { }

	async generateEmbeddings(data: GenerateEmbeddingDto): Promise<number[]> {
		try {
			const prompt = this.formatContext(data);

			const response = await axios.post(this.ollamaUrl, {
				model: this.modelName,
				prompt: prompt,
			});

			const embedding = response.data.embedding;

			if (!embedding || !Array.isArray(embedding)) {
				throw new Error('Failed generating embedding');
			}

			return embedding;
		}
		catch (error) {
			console.error('Error calling Ollama:', error.message);
			throw new InternalServerErrorException(
				'Error processing local artificial intelligence.',
			);
		}
	}

	private formatContext(data: GenerateEmbeddingDto): string {
		const { placeName, placeCategory, placeTags, placeDescription } = data;

		const tagsList = placeTags?.length > 0
			? placeTags.join(', ')
			: 'diversas características';

		let phrase = `O ${placeName} é um estabelecimento do tipo ${placeCategory} que tem as seguintes características: ${tagsList}.`;

		if (placeDescription) {
			phrase += ` É um ótimo local para ${placeDescription}`;
		}

		return phrase.trim();
	}

	async generateSearchEmbedding(query: string): Promise<number[]> {
		try {

			const response = await axios.post(this.ollamaUrl, {
				model: this.modelName,
				prompt: query
			})

			if (!response.data.embedding || !Array.isArray(response.data.embedding)) {
				throw new Error('Failed generating embedding');
			}

			return response.data.embedding
		}
		catch (error) {
			console.error('Error calling Ollama:', error.message);
			throw new InternalServerErrorException(
				'Error processing local artificial intelligence.',
			);
		}
	}
}