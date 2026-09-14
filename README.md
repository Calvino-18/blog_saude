## Integração com o Supabase

Antes de publicar a página, abra o SQL Editor do projeto Supabase e execute o conteúdo de [`supabase.sql`](supabase.sql). Ele cria a tabela `calculos_agua`, habilita RLS, permite a inserção pública dos cálculos e a leitura dos dados exibidos na lista de participantes.

A página usa somente a chave pública `anon`. Não use uma chave `service_role` no navegador. Os participantes informam apenas o nome e o peso; a lista pública exibe os nomes, o peso e a meta diária de água. Avalie informar aos usuários como esses dados serão utilizados.
