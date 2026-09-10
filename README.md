## Integração com o Supabase

Antes de publicar a página, abra o SQL Editor do projeto Supabase e execute o conteúdo de [`supabase.sql`](supabase.sql). Ele cria a tabela `calculos_agua`, habilita RLS e permite apenas a inserção pública dos cálculos.

A página usa somente a chave pública `anon`. Não use uma chave `service_role` no navegador. Como o formulário coleta nome e e-mail, mantenha o acesso de leitura bloqueado e avalie informar aos usuários como esses dados serão utilizados.
