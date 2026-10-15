# TechFide — site institucional

Landing page estática da TechFide (Matheus Barbosa Lheira Soluções em Tecnologia LTDA).

## Estrutura

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Landing page: hero, soluções, portfólio, processo, cloud & inovação, sobre, contato |
| `proposta-cloud.html` | Proposta de inovação para o programa de créditos do Google Cloud |
| `styles.css` | Tema escuro com a paleta do logo (`#0093FE`, preto, `#C2C2C2`) |
| `script.js` | Menu mobile, animações de entrada, link ativo e formulário → WhatsApp |
| `assets/` | Logos (`logo-icon`, `logo-tf`, `logo-full`), favicons e imagem Open Graph |
| `assets/produtos/` | Capturas reais dos produtos (1120×700, WebP) usadas como miniaturas na seção Produtos |

Sem build, sem dependências. Basta servir a pasta.

## Rodar localmente

```bash
python3 -m http.server 8080
# http://localhost:8080
```

## Publicar

- **Firebase Hosting:** `firebase init hosting` apontando a pasta pública para a raiz do repositório.
- **GitHub Pages:** Settings → Pages → branch `main`, pasta `/`.

Ao trocar o domínio, atualize as tags `canonical`, `og:url` e o JSON-LD em `index.html` e `proposta-cloud.html`.
