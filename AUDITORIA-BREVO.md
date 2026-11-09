# Auditoria técnica — formulário de novidades / Brevo

## Objetivo

Conectar o formulário de newsletter do site estático da Vinícola Garcia de Paula ao Brevo, adicionando os contatos à lista **"Novidades Garcia de Paula"** com confirmação dupla (*double opt-in*).

## Ambiente

- Site público: `https://fer23d.github.io/experiencias-garcia-de-paula/`
- Repositório: `https://github.com/Fer23d/experiencias-garcia-de-paula`
- Hospedagem: GitHub Pages (site HTML/CSS/JS estático, sem backend próprio)
- Provedor de formulários: Brevo / SibForms
- Formulário Brevo utilizado:

```text
https://2c1c5a8c.sibforms.com/serve/MUIFAJRMcMGJ-GAvI3ECC6drOoNxJEgK9qt8hCymYUfMyjWZ-bXmHk2YFu61O6en5gj6MHwuBuhWPABOZkeALb2KTxz-3UhhvwI5OUXnVjm-2LFFIs42VeJDVhxkMABABueW3m9yfiMwldK6HDfGlfngU7O6X8wacxX1-l46--XD59Zod_-JB1SucmU27HUag91t5PujcR4Av4Iv1Q==
```

## Configuração confirmada no Brevo

- Lista selecionada: **Novidades Garcia de Paula** (ID visual `#5`).
- Confirmação: **E-mail duplo de confirmação** habilitado.
- Página após validação por e-mail: URL da página inicial do GitHub Pages.
- E-mail final de confirmação: habilitado.
- O código HTML simples fornecido pelo Brevo possui somente os campos oficiais abaixo:

```html
<input name="EMAIL" required>
<input name="email_address_check" value="">
<input type="hidden" name="locale" value="pt">
<input type="hidden" name="html_type" value="simple">
```

## Erro observado pelo usuário

Após preencher e enviar o formulário, o navegador foi direcionado para o endpoint do Brevo e exibiu uma resposta técnica crua:

```json
{"success":true}
```

Não houve uma mensagem visual de sucesso dentro do site.

## Diagnóstico confirmado

`{"success":true}` **não é um erro do Brevo**. É a confirmação de que o endpoint recebeu e aceitou a solicitação de cadastro.

O problema é de experiência de uso: a submissão nativa do formulário (`POST`) abre a resposta JSON diretamente no navegador, em vez de mantê-la em segundo plano e mostrar uma mensagem elegante no rodapé do site.

Como a confirmação dupla está ativada, o contato só passa a integrar a lista após clicar no link enviado por e-mail pelo Brevo. Portanto, após uma resposta `success: true`, é esperado que o visitante ainda precise validar o e-mail.

## Alterações já realizadas no site

1. Mantidos somente os campos enviados no snippet oficial do Brevo. Campos visuais como nome e aceite de privacidade não são enviados como atributos adicionais, pois não estavam configurados no formulário Brevo fornecido.
2. Removido o código que clonava/removia um formulário temporário durante o envio.
3. Restaurado o envio nativo `POST` do formulário, que comprovadamente retornou `{"success":true}`.
4. Criado um `iframe` oculto com o nome `brevo-newsletter-submit` para receber a resposta do Brevo sem redirecionar a página.
5. O script agora tenta enviar o formulário nativo para esse `iframe` e exibir no site:

```text
Cadastro realizado. Confira seu e-mail para confirmar a assinatura.
```

6. O arquivo JavaScript foi versionado em todas as páginas como `newsletter.js?v=2`, evitando que o navegador reutilize uma cópia antiga em cache.

## Estado do código atual

Arquivo principal: `newsletter.js`

Fluxo esperado:

1. Usuário preenche nome, e-mail e marca o aceite de privacidade.
2. O formulário envia `EMAIL`, `email_address_check`, `locale` e `html_type` para o endpoint SibForms.
3. A resposta do endpoint deve abrir no iframe oculto.
4. O usuário continua na página e vê a mensagem de confirmação.
5. O Brevo envia o e-mail de *double opt-in*.
6. Após a validação pelo link, o Brevo adiciona o contato à lista e redireciona para a página inicial.

## Commits relevantes

- `ac8b0c7` — manteve o formulário durante o envio.
- `12585ad` — enviou pelo formulário Brevo diretamente.
- `5988dab` — usou a submissão nativa do Brevo.
- `a4b280e` — manteve a confirmação no site usando iframe oculto.
- `ca8881b` — versionou o JavaScript em todas as páginas para invalidar cache.

## O que o Claude deve verificar

1. **Submissão em iframe:** confirmar se um `form.target` atribuído no evento `submit` é respeitado nos navegadores atuais ou se o atributo `target="brevo-newsletter-submit"` e o iframe devem existir diretamente no HTML inicial.
2. **Melhor arquitetura de feedback:** propor uma implementação robusta que só mostre sucesso após o `iframe` carregar, sem acesso ao conteúdo cross-origin.
3. **Código oficial Brevo:** conferir se o endpoint atual exige algum campo, cabeçalho ou script adicional não presente no snippet HTML simples.
4. **Double opt-in:** confirmar se o formulário está publicado/ativo no Brevo e vinculado somente à lista `Novidades Garcia de Paula`.
5. **E-mail de confirmação:** verificar remetente, modelo e entregabilidade (spam/lixeira) no Brevo, pois `success: true` confirma a requisição, mas não garante a entrega da mensagem.
6. **Atributo de nome:** caso seja necessário salvar o nome, criar o atributo no Brevo e atualizar o formulário com o campo oficial que o Brevo gerar. Não inventar `FIRSTNAME` sem que ele exista na configuração Brevo.

## Recomendação

Usar o snippet oficial do Brevo como referência funcional e manter o design próprio do site. A solução deve preservar o POST nativo para o endpoint, mas ter o iframe nomeado no HTML desde o carregamento da página, com `target` também declarado no `<form>`. Isso elimina dependência de timing do JavaScript durante o clique e evita a tela JSON.
