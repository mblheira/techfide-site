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

O site é publicado na HostGator (techfide.com.br, pasta `public_html`) automaticamente a cada push na `main`,
pelo workflow `.github/workflows/deploy.yml` (FTPS com FTP-Deploy-Action). Ele também pode ser disparado à mão:

```bash
gh workflow run "Publicar no HostGator" --repo mblheira/techfide-site
```

Segredos usados pelo workflow (Settings → Secrets → Actions): `FTP_SERVER`, `FTP_USERNAME` e `FTP_PASSWORD`
da conta FTP `deploy@techfide.com.br`, criada no cPanel com diretório `/home2/math2418/public_html`.

Ao trocar o domínio, atualize as tags `canonical`, `og:url` e o JSON-LD em `index.html` e `proposta-cloud.html`.
