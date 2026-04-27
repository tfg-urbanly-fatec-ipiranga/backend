# Guia de Testes — Soft Delete

## Setup

```bash
# 1. Instalar dependências (se necessário)
pnpm install

# 2. Resetar banco e aplicar migrations
npx prisma migrate reset --force

# 3. Popular com dados de teste
npx prisma db seed

# 4. Subir o servidor
pnpm run start:dev
```

O servidor roda em `http://localhost:3000`. Todos os endpoints usam o prefixo `/v1`.

## Credenciais do seed

| Role  | Email               | Senha    |
|-------|---------------------|----------|
| ADMIN | admin@urbanly.com   | admin123 |
| USER  | joao@email.com      | user123  |
| USER  | maria@email.com     | user123  |
| USER  | pedro@email.com     | user123  |

---

## 1. Obter token JWT

Todos os endpoints (exceto login/register) exigem autenticação. Faça login para obter o token:

```bash
# Login como ADMIN
curl -s -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@urbanly.com","password":"admin123"}' | jq .
```

Copie o `accessToken` da resposta. Use-o nos próximos requests como:

```
-H "Authorization: Bearer <TOKEN>"
```

> Dica: salve numa variável para facilitar:
> ```bash
> TOKEN=$(curl -s -X POST http://localhost:3000/v1/auth/login \
>   -H "Content-Type: application/json" \
>   -d '{"email":"admin@urbanly.com","password":"admin123"}' | jq -r '.accessToken')
> ```

---

## 2. Testar soft delete de User

### 2.1 Listar usuários ativos

```bash
curl -s http://localhost:3000/v1/users \
  -H "Authorization: Bearer $TOKEN" | jq '.[].email'
```

Deve retornar os 4 usuários do seed.

### 2.2 Deletar um usuário (soft delete)

Copie o `id` do usuário `pedro@email.com` da listagem acima.

```bash
curl -s -X DELETE http://localhost:3000/v1/users/<PEDRO_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

A resposta retorna o usuário com `"active": false` e `"deletedAt"` preenchido.

### 2.3 Verificar que o usuário sumiu da listagem

```bash
curl -s http://localhost:3000/v1/users \
  -H "Authorization: Bearer $TOKEN" | jq '.[].email'
```

`pedro@email.com` não deve aparecer.

### 2.4 Verificar que o GET por ID retorna 404

```bash
curl -s http://localhost:3000/v1/users/<PEDRO_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Deve retornar `404 Not Found`.

### 2.5 Verificar que login do usuário deletado é bloqueado

```bash
curl -s -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pedro@email.com","password":"user123"}' | jq .
```

Deve retornar `401` com mensagem `"Conta desativada"`.

### 2.6 Listar inativos (ADMIN)

```bash
curl -s http://localhost:3000/v1/users/inactive \
  -H "Authorization: Bearer $TOKEN" | jq '.[].email'
```

Deve retornar apenas `pedro@email.com`.

### 2.7 Restaurar usuário

```bash
curl -s -X PATCH http://localhost:3000/v1/users/<PEDRO_ID>/restore \
  -H "Authorization: Bearer $TOKEN" | jq .
```

Resposta com `"active": true` e `"deletedAt": null`. Agora o login do Pedro volta a funcionar.

---

## 3. Testar soft delete de Category

### 3.1 Listar categorias

```bash
curl -s http://localhost:3000/v1/categories \
  -H "Authorization: Bearer $TOKEN" | jq '.[].name'
```

### 3.2 Deletar uma categoria

```bash
curl -s -X DELETE http://localhost:3000/v1/categories/<CATEGORY_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 3.3 Verificar que sumiu da listagem

```bash
curl -s http://localhost:3000/v1/categories \
  -H "Authorization: Bearer $TOKEN" | jq '.[].name'
```

### 3.4 Verificar que places da categoria continuam acessíveis

Os places que tinham essa categoria continuam funcionando (o `categoryId` é preservado).

```bash
curl -s http://localhost:3000/v1/places \
  -H "Authorization: Bearer $TOKEN" | jq '.[].name'
```

### 3.5 Listar inativas e restaurar

```bash
# Listar inativas
curl -s http://localhost:3000/v1/categories/inactive \
  -H "Authorization: Bearer $TOKEN" | jq .

# Restaurar
curl -s -X PATCH http://localhost:3000/v1/categories/<CATEGORY_ID>/restore \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 4. Testar soft delete de Place

### 4.1 Listar places ativos

```bash
curl -s http://localhost:3000/v1/places \
  -H "Authorization: Bearer $TOKEN" | jq '.[].name'
```

### 4.2 Deletar um place

```bash
curl -s -X DELETE http://localhost:3000/v1/places/<PLACE_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 4.3 Verificar que sumiu da listagem e da busca

```bash
# Listagem
curl -s http://localhost:3000/v1/places \
  -H "Authorization: Bearer $TOKEN" | jq '.[].name'

# Busca por tag (se o place tinha a tag)
curl -s "http://localhost:3000/v1/places/findByTag?tag=wifi" \
  -H "Authorization: Bearer $TOKEN" | jq '.[].name'
```

### 4.4 Listar inativos e restaurar

```bash
curl -s http://localhost:3000/v1/places/inactive \
  -H "Authorization: Bearer $TOKEN" | jq .

curl -s -X PATCH http://localhost:3000/v1/places/<PLACE_ID>/restore \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 5. Testar soft delete de Review

### 5.1 Listar reviews de um place

```bash
curl -s http://localhost:3000/v1/reviews/place/<PLACE_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 5.2 Deletar uma review

```bash
curl -s -X DELETE http://localhost:3000/v1/reviews/<REVIEW_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

A resposta retorna a review com `"deletedAt"` preenchido.

### 5.3 Verificar que sumiu da listagem

```bash
curl -s http://localhost:3000/v1/reviews/place/<PLACE_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 5.4 Verificar que o usuário pode criar nova review para o mesmo place

Como a review anterior foi soft-deleted, a constraint `unique(userId, placeId)` ainda existe no banco. O service verifica `deletedAt: null` ao checar duplicatas, então o usuário pode criar uma nova:

```bash
curl -s -X POST http://localhost:3000/v1/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"<USER_ID>","placeId":"<PLACE_ID>","rating":5,"comment":"Nova review!"}' | jq .
```

> ⚠️ Isso vai falhar com 409 porque a constraint `@@unique([userId, placeId])` no banco ainda conta o registro soft-deleted. Esse é um ponto conhecido — a constraint de unicidade no banco não diferencia soft-deleted. Se isso for um problema, a solução é remover a constraint do banco e validar apenas no service.

---

## 6. Testar soft delete de PlacePhoto

### 6.1 Listar fotos de um place

```bash
curl -s http://localhost:3000/v1/place-photos/place/<PLACE_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 6.2 Deletar uma foto

```bash
curl -s -X DELETE http://localhost:3000/v1/place-photos/<PHOTO_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### 6.3 Verificar que sumiu da listagem

```bash
curl -s http://localhost:3000/v1/place-photos/place/<PLACE_ID> \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## 7. Verificar no banco (opcional)

Para confirmar que os registros não foram removidos do banco:

```bash
npx prisma studio
```

Abre o Prisma Studio no navegador. Navegue até a tabela e veja que os registros soft-deleted ainda existem com `deletedAt` preenchido e `active: false`.

---

## Checklist resumido

| Cenário | Esperado | Endpoint |
|---------|----------|----------|
| DELETE user | `active: false`, `deletedAt` preenchido | `DELETE /v1/users/:id` |
| GET users após delete | Não retorna o deletado | `GET /v1/users` |
| GET user deletado por ID | 404 | `GET /v1/users/:id` |
| Login user deletado | 401 "Conta desativada" | `POST /v1/auth/login` |
| Listar inativos | Retorna apenas deletados | `GET /v1/users/inactive` |
| Restaurar | `active: true`, `deletedAt: null` | `PATCH /v1/users/:id/restore` |
| DELETE category | Soft delete, places preservados | `DELETE /v1/categories/:id` |
| DELETE place | Soft delete, não aparece em busca | `DELETE /v1/places/:id` |
| DELETE review | `deletedAt` preenchido | `DELETE /v1/reviews/:id` |
| DELETE photo | Soft delete | `DELETE /v1/place-photos/:id` |

---

## Ponto de atenção

A constraint `@@unique([userId, placeId])` na tabela Review impede que um usuário crie nova review para o mesmo place se a anterior foi soft-deleted (o registro ainda existe no banco). Se o time decidir que isso precisa ser permitido, a solução é remover a constraint do schema e manter a validação apenas no service (que já filtra por `deletedAt: null`).
