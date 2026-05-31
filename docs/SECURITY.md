# Segurança: Mundo do Lukinha

## Princípios
- Crianças são o público. Segurança é requisito absoluto
- Zero ads, zero tracking, zero links externos
- Dados ficam no dispositivo (localStorage)

## Proteções Implementadas
- PIN parental de 6 dígitos para área dos pais
- Sem coleta de dados sensíveis (CPF, escola, fotos, GPS)
- Sem redes sociais ou login com terceiros
- Validação de inputs (Zod ready)
- CSP headers configurados no next.config.js

## Quando Backend For Adicionado
- HTTPS obrigatório + HSTS
- JWT + refresh tokens (24h/7d)
- Rate limiting (5 tentativas → bloqueio 15min)
- RLS no Supabase (cada família só vê seus dados)
- Sanitização de inputs + CSRF tokens
- npm audit + Dependabot
