# Design: Refatoração para alinhar com Proposta Técnica

**Data:** 2026-03-16
**Autor:** Kiro
**Status:** Aprovado

## Contexto

O código atual do backend Urbanly diverge do modelo de dados definido na proposta técnica V2. Entidades como Categoria, Avaliação, Favorito e Foto de Estabelecimento não existem. O modelo User tem campos extras não previstos (firstName, lastName, userName, birthDate) e o Place não tem campos essenciais como endereco, cidade, ativo e categoria.

## Objetivos

- Alinhar o schema Prisma com o modelo ER da proposta técnica
- Simplificar User para refletir a proposta (name ao invés de firstName/lastName/userName)
- Adicionar entidades faltantes: Category, Review, Favorite, PlacePhoto
- Atualizar DTOs, services e controllers existentes
- Criar módulos novos: CategoriesModule, ReviewsModule, FavoritesModule

## Não-Objetivos

- Implementar autenticação/autorização (Auth Module)
- Implementar upload de fotos de estabelecimentos (só schema)
- Implementar busca avançada com filtros (RF006)
- Implementar lógica de visualização resumida vs completa (RN006/RN007)

## Proposta

### Schema Prisma

**User** — simplificar:
- Remover: firstName, lastName, userName, birthDate
- Adicionar: name (String)
- Manter: id, email, password, role, avatar, createdAt, updatedAt
- Adicionar relações: reviews, favorites

**Place** — alinhar:
- Remover: federalTaxPayerId
- Adicionar: address (String), city (String), active (Boolean, default true), categoryId (FK)
- Manter: id, name, description, openingTime, closingTime, latitude, longitude, createdAt, updatedAt
- Adicionar relações: category, reviews, favorites, photos

**Novas entidades:**
- Category (id, name, iconColor, description, createdAt, updatedAt)
- Review (id, userId, placeId, rating Int 1-5, comment, createdAt, updatedAt) — unique [userId, placeId]
- Favorite (id, userId, placeId, createdAt) — unique [userId, placeId]
- PlacePhoto (id, placeId, url, caption, isPrimary, createdAt) — só schema

**Tag/PlaceTag** — mantém como está.

### Módulos

- UsersModule — atualizar DTOs/service para novo schema
- PlacesModule — atualizar DTOs/service para novos campos
- CategoriesModule (novo) — CRUD básico
- ReviewsModule (novo) — criar/editar/listar/deletar avaliações
- FavoritesModule (novo) — adicionar/remover/listar favoritos

### Tratamento de Erros

- Review: ConflictException se usuário já avaliou o place (RN003)
- Review: rating validado entre 1-5 via class-validator
- Favorite: ConflictException se já favoritado, toggle via endpoint único
- Place: busca filtra por active=true por padrão (RN005)
- Category: NotFoundException quando não encontrada

## Alternativas Consideradas

1. Renomear tudo para português (Place→Estabelecimento, etc) — rejeitado por convenção de código
2. Manter campos extras do User — rejeitado para simplificar e alinhar com proposta

## Riscos e Mitigações

- Migration destrutiva (remover colunas do User/Place) — banco de dev, aceitável
- Quebra de API existente — branch separada, merge controlado
