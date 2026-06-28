-- Ícone escolhível por categoria (mega-menu "Produtos" no topo do site).
-- Guarda apenas a CHAVE do ícone (string estável). A resolução chave → componente
-- lucide acontece no front (src/lib/category-icons.ts).

alter table public.categorias
  add column if not exists icone text;

-- Semente: ícones padrão das 8 linhas Shinova (mantém o visual atual).
update public.categorias set icone = 'activity'    where slug = 'anestesia-monitorizacao' and icone is null;
update public.categorias set icone = 'scan'        where slug = 'imagem-diagnostico'      and icone is null;
update public.categorias set icone = 'test-tube'   where slug = 'laboratorio-clinico'      and icone is null;
update public.categorias set icone = 'heart-pulse' where slug = 'tratamento-recuperacao'   and icone is null;
update public.categorias set icone = 'stethoscope' where slug = 'odontologia-veterinaria'  and icone is null;
update public.categorias set icone = 'eye'         where slug = 'oftalmologia-veterinaria' and icone is null;
update public.categorias set icone = 'microscope'  where slug = 'exame-diagnostico'        and icone is null;
update public.categorias set icone = 'scissors'    where slug = 'pet-grooming-estetica'    and icone is null;
