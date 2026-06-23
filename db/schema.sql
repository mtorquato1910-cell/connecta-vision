-- ============================================================
-- PROJETO : Conecta Vision - Distribuidora Veterinaria
-- ARQUIVO : schema inicial do banco MySQL (site + admin)
-- VERSAO  : 1.0.0
-- DATA    : 2026-05-28
-- STACK   : TanStack Start + React 19 (MySQL no servidor do cliente)
-- AUTORIA : PM (estrutura) + Architect + QA (validacoes) - orquestrado por Orion (AIOS Master)
-- ============================================================
-- Cobre: produtos, categorias, blog (moderado), eventos (galeria),
-- formularios (contato + orcamentos), conteudo editavel, configuracoes,
-- home, admin (usuarios/sessoes/auditoria), biblioteca de imagens,
-- consent LGPD (formulario + cookie), rate_limit e versionamento.
-- ============================================================
-- ALTERACOES FUTURAS:
-- Cada nova migracao deve receber um arquivo proprio (db/migrations/NNNN_nome.sql)
-- e ser registrada em schema_migrations.
-- ============================================================

/* ------------------------------------------------------------
   CONFIGURACOES GLOBAIS DE SESSAO
   ------------------------------------------------------------ */
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET SQL_MODE = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
SET time_zone = '-03:00';
-- Observacao: TIMESTAMP armazena em UTC e converte na leitura.
-- A app deve setar time_zone='-03:00' ou converter UTC->BR no frontend.

-- ============================================================
-- SECTION 0: DATABASE
-- ============================================================
CREATE DATABASE IF NOT EXISTS conecta_vision
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE conecta_vision;

-- ============================================================
-- SECTION 1: DROPS (comentados - usar APENAS em ambiente DEV)
-- ============================================================
-- DROP TABLE IF EXISTS audit_log;
-- DROP TABLE IF EXISTS admin_session;
-- DROP TABLE IF EXISTS admin_user;
-- DROP TABLE IF EXISTS home_produto_destaque;
-- DROP TABLE IF EXISTS home_secao;
-- DROP TABLE IF EXISTS configuracao;
-- DROP TABLE IF EXISTS conteudo_item;
-- DROP TABLE IF EXISTS rate_limit;
-- DROP TABLE IF EXISTS cookie_consent_log;
-- DROP TABLE IF EXISTS formulario;
-- DROP TABLE IF EXISTS evento_imagem;
-- DROP TABLE IF EXISTS evento;
-- DROP TABLE IF EXISTS blog_post_tag;
-- DROP TABLE IF EXISTS blog_post;
-- DROP TABLE IF EXISTS blog_tag;
-- DROP TABLE IF EXISTS produto_especificacao;
-- DROP TABLE IF EXISTS produto_imagem;
-- DROP TABLE IF EXISTS produto;
-- DROP TABLE IF EXISTS categoria;
-- DROP TABLE IF EXISTS imagem;
-- DROP TABLE IF EXISTS schema_migrations;

-- ============================================================
-- SECTION 2: SCHEMA_MIGRATIONS (controle de versao)
-- ============================================================
CREATE TABLE IF NOT EXISTS schema_migrations (
  version    VARCHAR(40)  NOT NULL                COMMENT 'Numero da migracao (ex: 0001, 0002)',
  name       VARCHAR(160) NOT NULL                COMMENT 'Nome legivel da migracao',
  checksum   CHAR(64)     NULL                    COMMENT 'SHA-256 do conteudo da migracao',
  applied_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de aplicacao',
  PRIMARY KEY (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Controle de versoes do schema do banco';

-- ============================================================
-- SECTION 3: CATEGORIA
-- ============================================================
CREATE TABLE IF NOT EXISTS categoria (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador interno da categoria',
  slug            VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'Slug case-sensitive usado em URLs',
  nome            VARCHAR(160) NOT NULL                    COMMENT 'Nome exibido publicamente',
  descricao_curta VARCHAR(500) NULL                        COMMENT 'Descricao curta usada em cards e SEO',
  numero          INT UNSIGNED NULL                        COMMENT 'Numero sequencial original (referencia ao catalogo do cliente)',
  ordem           INT UNSIGNED NOT NULL DEFAULT 0          COMMENT 'Ordem de exibicao no site (asc)',
  destaque        TINYINT(1) NOT NULL DEFAULT 0            COMMENT '1 = aparece em destaques na home',
  fonte_aba       VARCHAR(120) NULL                        COMMENT 'Nome da aba/origem na planilha importada',
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao do registro (UTC)',
  atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_categoria_slug (slug),
  KEY idx_categoria_ordem (ordem),
  KEY idx_categoria_destaque (destaque)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Categorias de produtos da distribuidora veterinaria';

-- ============================================================
-- SECTION 4: PRODUTO
-- ============================================================
-- IMPORTANTE: categoria_slug e categoria_nome sao denormalizados
-- para queries rapidas. Mantidos consistentes via trigger
-- trg_categoria_sync_produto (definido na SECTION 22).
-- ============================================================
CREATE TABLE IF NOT EXISTS produto (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador interno do produto',
  slug               VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'Slug case-sensitive para URL',
  modelo             VARCHAR(120) NULL                        COMMENT 'Modelo / SKU do fabricante',
  nome               VARCHAR(255) NOT NULL                    COMMENT 'Nome comercial do produto',
  marca              VARCHAR(120) NULL                        COMMENT 'Marca / fabricante',
  categoria_id       BIGINT UNSIGNED NULL                     COMMENT 'FK para categoria (nullable: produto nao orfaniza em delete)',
  categoria_slug     VARCHAR(160) NULL                        COMMENT 'Slug da categoria denormalizado (sincronizado por trigger)',
  categoria_nome     VARCHAR(160) NULL                        COMMENT 'Nome da categoria denormalizado (sincronizado por trigger)',
  subcategoria       VARCHAR(160) NULL                        COMMENT 'Subcategoria textual (opcional)',
  descricao_curta    VARCHAR(500) NULL                        COMMENT 'Resumo usado em cards e SEO',
  descricao_longa    TEXT NULL                                COMMENT 'Descricao detalhada (HTML permitido)',
  configuracoes      TEXT NULL                                COMMENT 'Configuracoes / opcionais em texto livre',
  imagem_principal   VARCHAR(2048) NULL                       COMMENT 'URL da imagem principal do produto',
  video_url          VARCHAR(500) NULL                        COMMENT 'URL opcional de video do produto',
  url_fabricante     VARCHAR(2048) NULL                       COMMENT 'Link para a pagina oficial do fabricante',
  destaque           TINYINT(1) NOT NULL DEFAULT 0            COMMENT '1 = exibe na secao de destaques',
  publicado          TINYINT(1) NOT NULL DEFAULT 1            COMMENT '1 = visivel no site publico',
  deletado_em        TIMESTAMP NULL                           COMMENT 'Soft delete: NULL = ativo',
  criado_em          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  atualizado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_produto_slug (slug),
  KEY idx_produto_categoria_id (categoria_id),
  KEY idx_produto_categoria_slug (categoria_slug),
  KEY idx_produto_marca (marca),
  KEY idx_produto_modelo (modelo),
  KEY idx_produto_deletado (deletado_em),
  KEY idx_produto_listagem (publicado, destaque, id),
  CONSTRAINT fk_produto_categoria
    FOREIGN KEY (categoria_id) REFERENCES categoria (id)
    ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catalogo de produtos do site Conecta Vision';

-- ============================================================
-- SECTION 5: PRODUTO_IMAGEM (galeria)
-- ============================================================
CREATE TABLE IF NOT EXISTS produto_imagem (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da imagem do produto',
  produto_id    BIGINT UNSIGNED NOT NULL                COMMENT 'FK para produto.id',
  url           VARCHAR(2048) NOT NULL                   COMMENT 'URL absoluta ou relativa da imagem',
  alt           VARCHAR(255) NULL                        COMMENT 'Texto alternativo para acessibilidade/SEO',
  ordem         INT UNSIGNED NOT NULL DEFAULT 0          COMMENT 'Ordem de exibicao na galeria',
  is_principal  TINYINT(1) NOT NULL DEFAULT 0            COMMENT '1 = imagem principal (capa)',
  criado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  PRIMARY KEY (id),
  KEY idx_produto_imagem_produto_id (produto_id),
  KEY idx_produto_imagem_ordem (ordem),
  KEY idx_produto_imagem_principal (is_principal),
  CONSTRAINT fk_produto_imagem_produto
    FOREIGN KEY (produto_id) REFERENCES produto (id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Galeria de imagens por produto';

-- ============================================================
-- SECTION 6: PRODUTO_ESPECIFICACAO (ficha tecnica)
-- ============================================================
CREATE TABLE IF NOT EXISTS produto_especificacao (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da especificacao',
  produto_id  BIGINT UNSIGNED NOT NULL                COMMENT 'FK para produto.id',
  chave       VARCHAR(160) NOT NULL                    COMMENT 'Nome da especificacao (ex: Tensao, Peso)',
  valor       VARCHAR(500) NOT NULL                    COMMENT 'Valor da especificacao',
  ordem       INT UNSIGNED NOT NULL DEFAULT 0          COMMENT 'Ordem de exibicao',
  PRIMARY KEY (id),
  KEY idx_produto_espec_produto_id (produto_id),
  KEY idx_produto_espec_ordem (ordem),
  CONSTRAINT fk_produto_espec_produto
    FOREIGN KEY (produto_id) REFERENCES produto (id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Ficha tecnica chave-valor por produto';

-- ============================================================
-- SECTION 7: BLOG_TAG
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_tag (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da tag',
  nome       VARCHAR(120) NOT NULL                    COMMENT 'Nome legivel da tag',
  slug       VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'Slug usado em URLs',
  criado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_blog_tag_nome (nome),
  UNIQUE KEY uk_blog_tag_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tags reutilizaveis do blog';

-- ============================================================
-- SECTION 8: BLOG_POST
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_post (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do post',
  slug            VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'Slug unico para URL',
  titulo          VARCHAR(255) NOT NULL                    COMMENT 'Titulo do post',
  resumo          VARCHAR(500) NULL                        COMMENT 'Resumo / chamada usada em cards e SEO',
  conteudo        LONGTEXT NULL                            COMMENT 'Corpo completo (HTML ou Markdown)',
  capa_url        VARCHAR(2048) NULL                       COMMENT 'URL da imagem de capa',
  video_url       VARCHAR(500) NULL                        COMMENT 'URL opcional de video embed',
  autor_nome      VARCHAR(160) NULL                        COMMENT 'Nome do autor',
  autor_email     VARCHAR(255) NULL                        COMMENT 'Email de contato do autor',
  status          ENUM('pendente','rascunho','revisao','agendado','publicado','rejeitado','arquivado') NOT NULL DEFAULT 'pendente' COMMENT 'Status editorial/moderacao',
  origem          ENUM('publico','admin') NOT NULL DEFAULT 'admin' COMMENT 'Origem do envio',
  motivo_rejeicao VARCHAR(500) NULL                        COMMENT 'Motivo da rejeicao (se aplicavel)',
  publicado_em    TIMESTAMP NULL                           COMMENT 'Data efetiva de publicacao (UTC)',
  deletado_em     TIMESTAMP NULL                           COMMENT 'Soft delete: NULL = ativo',
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_blog_post_slug (slug),
  KEY idx_blog_post_status (status),
  KEY idx_blog_post_origem (origem),
  KEY idx_blog_post_listagem (status, publicado_em),
  KEY idx_blog_post_deletado (deletado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Posts do blog (admin + envios publicos moderados)';

-- ============================================================
-- SECTION 9: BLOG_POST_TAG (N:N)
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_post_tag (
  post_id  BIGINT UNSIGNED NOT NULL COMMENT 'FK para blog_post.id',
  tag_id   BIGINT UNSIGNED NOT NULL COMMENT 'FK para blog_tag.id',
  PRIMARY KEY (post_id, tag_id),
  KEY idx_blog_post_tag_tag_id (tag_id),
  CONSTRAINT fk_blog_post_tag_post
    FOREIGN KEY (post_id) REFERENCES blog_post (id)
    ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT fk_blog_post_tag_tag
    FOREIGN KEY (tag_id) REFERENCES blog_tag (id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tabela de juncao posts x tags';

-- ============================================================
-- SECTION 10: EVENTO
-- ============================================================
CREATE TABLE IF NOT EXISTS evento (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do evento',
  slug            VARCHAR(160) CHARACTER SET ascii COLLATE ascii_bin NOT NULL COMMENT 'Slug unico para URL',
  nome            VARCHAR(255) NOT NULL                    COMMENT 'Nome do evento',
  data_evento     DATE NULL                                COMMENT 'Data principal do evento',
  local           VARCHAR(255) NULL                        COMMENT 'Local / cidade do evento',
  descricao_curta VARCHAR(500) NULL                        COMMENT 'Resumo usado em cards',
  descricao_longa TEXT NULL                                COMMENT 'Descricao detalhada (HTML permitido)',
  capa_url        VARCHAR(2048) NULL                       COMMENT 'URL da imagem de capa',
  publicado       TINYINT(1) NOT NULL DEFAULT 1            COMMENT '1 = visivel no site',
  ordem           INT UNSIGNED NOT NULL DEFAULT 0          COMMENT 'Ordem manual de exibicao',
  deletado_em     TIMESTAMP NULL                           COMMENT 'Soft delete: NULL = ativo',
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  atualizado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_evento_slug (slug),
  KEY idx_evento_data (data_evento),
  KEY idx_evento_listagem (publicado, data_evento),
  KEY idx_evento_ordem (ordem),
  KEY idx_evento_deletado (deletado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Eventos / feiras da distribuidora (galeria publica)';

-- ============================================================
-- SECTION 11: EVENTO_IMAGEM
-- ============================================================
CREATE TABLE IF NOT EXISTS evento_imagem (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da imagem do evento',
  evento_id  BIGINT UNSIGNED NOT NULL                COMMENT 'FK para evento.id',
  url        VARCHAR(2048) NOT NULL                   COMMENT 'URL da imagem',
  alt        VARCHAR(255) NULL                        COMMENT 'Texto alternativo (acessibilidade)',
  caption    VARCHAR(500) NULL                        COMMENT 'Legenda exibida na galeria',
  ordem      INT UNSIGNED NOT NULL DEFAULT 0          COMMENT 'Ordem de exibicao',
  criado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  PRIMARY KEY (id),
  KEY idx_evento_imagem_evento_id (evento_id),
  KEY idx_evento_imagem_ordem (ordem),
  CONSTRAINT fk_evento_imagem_evento
    FOREIGN KEY (evento_id) REFERENCES evento (id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Galeria de imagens por evento';

-- ============================================================
-- SECTION 12: FORMULARIO (contato + orcamentos) - INCLUI CONSENT LGPD
-- ============================================================
-- ATENCAO LGPD: aplicacao DEVE preencher aceite_lgpd_em, aceite_lgpd_ip
-- e politica_versao no momento do envio. Sem isso o INSERT nao deve ocorrer.
-- ============================================================
CREATE TABLE IF NOT EXISTS formulario (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do envio',
  tipo                  ENUM('contato','orcamento_geral','orcamento_produto') NOT NULL COMMENT 'Tipo do formulario',
  nome                  VARCHAR(160) NOT NULL                    COMMENT 'Nome do solicitante',
  email                 VARCHAR(255) NULL                        COMMENT 'Email de contato',
  whatsapp              VARCHAR(40) NULL                         COMMENT 'WhatsApp formatado',
  telefone              VARCHAR(40) NULL                         COMMENT 'Telefone fixo (opcional)',
  tipo_estabelecimento  VARCHAR(120) NULL                        COMMENT 'Clinica, hospital, universidade etc',
  nome_estabelecimento  VARCHAR(255) NULL                        COMMENT 'Nome do estabelecimento',
  cidade                VARCHAR(120) NULL                        COMMENT 'Cidade',
  estado                CHAR(2) NULL                             COMMENT 'UF (2 letras maiusculas)',
  cargo                 VARCHAR(120) NULL                        COMMENT 'Cargo / funcao',
  produto_id            BIGINT UNSIGNED NULL                     COMMENT 'FK para produto (orcamento_produto)',
  produto_modelo        VARCHAR(120) NULL                        COMMENT 'Snapshot do produto - NAO normalizar (preserva historico)',
  produto_nome          VARCHAR(255) NULL                        COMMENT 'Snapshot do produto - NAO normalizar (preserva historico)',
  mensagem              TEXT NULL                                COMMENT 'Mensagem livre do solicitante',
  -- ========================================
  -- CONSENT LGPD (BLOQUEADOR QA #1)
  -- ========================================
  aceite_lgpd_em        TIMESTAMP NULL                           COMMENT 'Data/hora do aceite da politica de privacidade (UTC)',
  aceite_lgpd_ip        VARCHAR(45) NULL                         COMMENT 'IP de origem do aceite (IPv4/IPv6) - PII, retencao 12 meses',
  politica_versao       VARCHAR(20) NULL                         COMMENT 'Versao da politica de privacidade aceita',
  consentimento_texto   TEXT NULL                                COMMENT 'Texto exato do checkbox de aceite (audit trail)',
  -- ========================================
  status                ENUM('novo','em_contato','qualificado','convertido','perdido','arquivado') NOT NULL DEFAULT 'novo' COMMENT 'Status comercial',
  notas_internas        TEXT NULL                                COMMENT 'Notas privadas do time comercial',
  origem_pagina         VARCHAR(255) NULL                        COMMENT 'URL ou nome da pagina de origem',
  anonimizado_em        TIMESTAMP NULL                           COMMENT 'Data de anonimizacao por retencao LGPD',
  criado_em             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de envio (UTC)',
  atualizado_em         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  KEY idx_formulario_tipo (tipo),
  KEY idx_formulario_status (status),
  KEY idx_formulario_status_criado (status, criado_em),
  KEY idx_formulario_email (email),
  KEY idx_formulario_produto_id (produto_id),
  KEY idx_formulario_criado_em (criado_em),
  KEY idx_formulario_anonimizado (anonimizado_em),
  CONSTRAINT fk_formulario_produto
    FOREIGN KEY (produto_id) REFERENCES produto (id)
    ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Leads de contato e orcamentos (PII - retencao 24 meses apos status=perdido)';

-- ============================================================
-- SECTION 13: COOKIE_CONSENT_LOG (BLOQUEADOR QA #4 - LGPD)
-- ============================================================
CREATE TABLE IF NOT EXISTS cookie_consent_log (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do registro',
  visitor_id         VARCHAR(64) NOT NULL                     COMMENT 'UUID gerado no cliente (cookie anonimo)',
  aceite_em          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data/hora do aceite (UTC)',
  ip_hash            CHAR(64) NULL                            COMMENT 'SHA-256 do IP (LGPD friendly, nao armazena IP puro)',
  user_agent         VARCHAR(500) NULL                        COMMENT 'User-Agent do navegador',
  politica_versao    VARCHAR(20) NOT NULL                     COMMENT 'Versao da politica aceita',
  categorias_aceitas JSON NOT NULL                            COMMENT 'JSON: {"necessarios":true,"analytics":false,"marketing":false}',
  acao               ENUM('aceitar_todos','recusar_todos','personalizado','revogar') NOT NULL COMMENT 'Acao realizada pelo usuario',
  PRIMARY KEY (id),
  KEY idx_cookie_visitor (visitor_id, aceite_em),
  KEY idx_cookie_politica (politica_versao),
  KEY idx_cookie_aceite (aceite_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log de aceite de cookies (LGPD - retencao 24 meses)';

-- ============================================================
-- SECTION 14: CONTEUDO_ITEM (textos editaveis)
-- ============================================================
CREATE TABLE IF NOT EXISTS conteudo_item (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do conteudo',
  chave          VARCHAR(160) NOT NULL                    COMMENT 'Chave unica (ex: home.hero.titulo)',
  valor          TEXT NULL                                COMMENT 'Conteudo editavel pelo admin',
  tipo           ENUM('texto','html','url','numero') NOT NULL DEFAULT 'texto' COMMENT 'Tipo de renderizacao',
  pagina         ENUM('home','sobre','contato','global','footer','privacidade','termos') NOT NULL DEFAULT 'global' COMMENT 'Pagina/escopo',
  label          VARCHAR(160) NULL                        COMMENT 'Rotulo amigavel exibido no admin',
  descricao      VARCHAR(500) NULL                        COMMENT 'Help text para o editor',
  multiline      TINYINT(1) NOT NULL DEFAULT 0            COMMENT '1 = renderizar textarea',
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_conteudo_item_chave (chave),
  KEY idx_conteudo_item_pagina (pagina),
  KEY idx_conteudo_item_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Textos editaveis das paginas (chave/valor)';

-- ============================================================
-- SECTION 15: CONFIGURACAO (singleton key/value)
-- ============================================================
CREATE TABLE IF NOT EXISTS configuracao (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da configuracao',
  chave          VARCHAR(160) NOT NULL                    COMMENT 'Chave unica de configuracao',
  valor          TEXT NULL                                COMMENT 'Valor da configuracao',
  grupo          ENUM('empresa','contato','redes','seo','geral') NOT NULL DEFAULT 'geral' COMMENT 'Grupo logico no admin',
  label          VARCHAR(160) NULL                        COMMENT 'Rotulo amigavel',
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_configuracao_chave (chave),
  KEY idx_configuracao_grupo (grupo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Configuracoes globais do site (singleton chave/valor)';

-- ============================================================
-- SECTION 16: HOME_SECAO
-- ============================================================
CREATE TABLE IF NOT EXISTS home_secao (
  id                VARCHAR(40) NOT NULL                COMMENT 'Identificador textual da secao',
  label             VARCHAR(160) NOT NULL                COMMENT 'Nome legivel no admin',
  descricao         VARCHAR(500) NULL                    COMMENT 'Descricao do papel da secao',
  ordem             INT UNSIGNED NOT NULL DEFAULT 0      COMMENT 'Ordem de exibicao',
  ativa             TINYINT(1) NOT NULL DEFAULT 1        COMMENT '1 = renderiza na home',
  template          VARCHAR(40) NULL                     COMMENT 'Template visual (hero, grid_produtos, banner_cta...)',
  gerenciavel_admin TINYINT(1) NOT NULL DEFAULT 0        COMMENT '1 = admin pode criar/remover seções deste tipo',
  atualizado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  KEY idx_home_secao_ordem (ordem),
  KEY idx_home_secao_ativa (ativa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Configuracao das secoes da home';

-- ============================================================
-- SECTION 17: HOME_PRODUTO_DESTAQUE
-- ============================================================
CREATE TABLE IF NOT EXISTS home_produto_destaque (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador',
  produto_id  BIGINT UNSIGNED NOT NULL                COMMENT 'FK para produto.id',
  ordem       INT UNSIGNED NOT NULL DEFAULT 0          COMMENT 'Ordem no carrossel',
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_home_destaque_produto (produto_id),
  KEY idx_home_destaque_ordem (ordem),
  CONSTRAINT fk_home_destaque_produto
    FOREIGN KEY (produto_id) REFERENCES produto (id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Produtos selecionados para destaques da home';

-- ============================================================
-- SECTION 18: ADMIN_USER (com seguranca reforcada - BLOQUEADORES QA #3)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_user (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador do usuario admin',
  email                 VARCHAR(255) NOT NULL                    COMMENT 'Email de login (unico)',
  senha_hash            VARCHAR(255) NOT NULL                    COMMENT 'Hash bcrypt da senha (cost >= 12)',
  nome                  VARCHAR(160) NOT NULL                    COMMENT 'Nome de exibicao',
  role                  ENUM('admin','editor') NOT NULL DEFAULT 'admin' COMMENT 'Perfil de acesso',
  ativo                 TINYINT(1) NOT NULL DEFAULT 1            COMMENT '1 = pode fazer login',
  forcar_troca_senha    TINYINT(1) NOT NULL DEFAULT 0            COMMENT '1 = forca troca no proximo login',
  senha_trocada_em      TIMESTAMP NULL                           COMMENT 'Ultima troca de senha (UTC)',
  tentativas_login      INT UNSIGNED NOT NULL DEFAULT 0          COMMENT 'Contador de tentativas falhas (zera no sucesso)',
  bloqueado_ate         TIMESTAMP NULL                           COMMENT 'Bloqueio temporario por tentativas (NULL = liberado)',
  ultimo_login_em       TIMESTAMP NULL                           COMMENT 'Data do ultimo login com sucesso (UTC)',
  ultimo_login_ip       VARCHAR(45) NULL                         COMMENT 'IP do ultimo login (PII - retencao 90 dias)',
  totp_secret           VARCHAR(64) NULL                         COMMENT 'Segredo TOTP para 2FA (criptografado em rest)',
  criado_em             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  atualizado_em         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data da ultima atualizacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_user_email (email),
  KEY idx_admin_user_ativo (ativo),
  KEY idx_admin_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Usuarios do painel admin (2FA opcional, bloqueio por tentativas)';

-- ============================================================
-- SECTION 19: ADMIN_SESSION (token armazenado como hash - BLOQUEADOR QA #2)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_session (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador da sessao',
  admin_user_id  BIGINT UNSIGNED NOT NULL                COMMENT 'FK para admin_user.id',
  token_hash     CHAR(64) NOT NULL                        COMMENT 'SHA-256 hex do token (NUNCA armazenar token puro)',
  token_prefix   CHAR(8) NULL                             COMMENT 'Primeiros 8 chars do token para identificar nos logs',
  ip             VARCHAR(45) NULL                         COMMENT 'IP de origem (IPv4/IPv6) - PII',
  user_agent     VARCHAR(500) NULL                        COMMENT 'User-Agent do navegador',
  expira_em      TIMESTAMP NOT NULL                       COMMENT 'Data de expiracao (UTC)',
  revogada_em    TIMESTAMP NULL                           COMMENT 'Logout/revogacao manual (NULL = ativa)',
  criado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criacao (UTC)',
  PRIMARY KEY (id),
  UNIQUE KEY uk_admin_session_token_hash (token_hash),
  KEY idx_admin_session_user (admin_user_id),
  KEY idx_admin_session_expira (expira_em),
  CONSTRAINT fk_admin_session_user
    FOREIGN KEY (admin_user_id) REFERENCES admin_user (id)
    ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Sessoes do admin (token SHA-256, purge por expira_em)';

-- ============================================================
-- SECTION 20: AUDIT_LOG
-- ============================================================
-- FORMATO do payload (documentado):
-- { "before": {...}, "after": {...}, "actor_email": "...", "context": {...} }
-- Retencao: 12 meses (job de purge mensal)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador',
  admin_user_id  BIGINT UNSIGNED NULL                     COMMENT 'FK para admin_user (NULL se removido)',
  entidade       VARCHAR(120) NOT NULL                    COMMENT 'Nome da entidade afetada',
  entidade_id    BIGINT UNSIGNED NULL                     COMMENT 'ID da entidade afetada',
  acao           ENUM('criar','atualizar','deletar','publicar','despublicar','login','logout','login_falha','reset_senha') NOT NULL COMMENT 'Acao registrada',
  payload        JSON NULL                                COMMENT 'Snapshot/diff em JSON (ver formato acima)',
  ip             VARCHAR(45) NULL                         COMMENT 'IP de origem (PII - retencao 12 meses)',
  criado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data do evento (UTC)',
  PRIMARY KEY (id),
  KEY idx_audit_user (admin_user_id),
  KEY idx_audit_entidade (entidade, entidade_id),
  KEY idx_audit_acao (acao),
  KEY idx_audit_criado_em (criado_em),
  CONSTRAINT fk_audit_user
    FOREIGN KEY (admin_user_id) REFERENCES admin_user (id)
    ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Log de auditoria de acoes do painel admin (retencao 12 meses)';

-- ============================================================
-- SECTION 21: RATE_LIMIT (protecao de formulario e login)
-- ============================================================
CREATE TABLE IF NOT EXISTS rate_limit (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  chave       VARCHAR(190) NOT NULL                        COMMENT 'Ex: form:ip:1.2.3.4 ou login:email:x@y.com',
  janela_ini  TIMESTAMP NOT NULL                           COMMENT 'Inicio da janela (truncado por minuto/hora)',
  contador    INT UNSIGNED NOT NULL DEFAULT 1              COMMENT 'Numero de tentativas na janela',
  PRIMARY KEY (id),
  UNIQUE KEY uk_rate_chave_janela (chave, janela_ini),
  KEY idx_rate_janela (janela_ini)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Rate limit para formularios publicos e login admin';

-- ============================================================
-- SECTION 22: IMAGEM (biblioteca reusavel)
-- ============================================================
CREATE TABLE IF NOT EXISTS imagem (
  id              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Identificador',
  url             VARCHAR(2048) NOT NULL                   COMMENT 'URL publica',
  nome_original   VARCHAR(255) NULL                        COMMENT 'Nome original do arquivo',
  mime            VARCHAR(80) NULL                         COMMENT 'Mime-type (ex: image/png)',
  tamanho_bytes   BIGINT UNSIGNED NULL                     COMMENT 'Tamanho em bytes',
  largura         INT UNSIGNED NULL                        COMMENT 'Largura em pixels',
  altura          INT UNSIGNED NULL                        COMMENT 'Altura em pixels',
  alt             VARCHAR(255) NULL                        COMMENT 'Texto alternativo padrao',
  pasta           VARCHAR(160) NULL                        COMMENT 'Pasta logica de organizacao',
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de upload (UTC)',
  PRIMARY KEY (id),
  KEY idx_imagem_pasta (pasta),
  KEY idx_imagem_criado_em (criado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Biblioteca central de imagens reutilizaveis';

-- ============================================================
-- SECTION 23: TRIGGER - Sincroniza denormalizacao categoria -> produto
-- ============================================================
DROP TRIGGER IF EXISTS trg_categoria_sync_produto;
DELIMITER $$
CREATE TRIGGER trg_categoria_sync_produto
AFTER UPDATE ON categoria
FOR EACH ROW
BEGIN
  IF NEW.slug <> OLD.slug OR NEW.nome <> OLD.nome THEN
    UPDATE produto
       SET categoria_slug = NEW.slug,
           categoria_nome = NEW.nome
     WHERE categoria_id = NEW.id;
  END IF;
END$$
DELIMITER ;

-- ============================================================
-- SECTION 24: SEEDS - SCHEMA_MIGRATIONS
-- ============================================================
INSERT INTO schema_migrations (version, name)
VALUES ('0001', 'initial_schema_v1.0.0')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ============================================================
-- SECTION 25: SEEDS - CATEGORIAS (8 categorias vet)
-- ============================================================
INSERT INTO categoria (slug, nome, descricao_curta, numero, ordem, destaque, fonte_aba) VALUES
  ('anestesia-monitorizacao', 'Anestesia e Monitorizacao', 'Equipamentos de anestesia inalatoria, monitores multiparametros e capnografos veterinarios.', 1, 1, 1, 'Anestesia'),
  ('cirurgia',                'Cirurgia',                  'Mesas cirurgicas, focos, bisturis eletricos e instrumentais para centro cirurgico veterinario.', 2, 2, 1, 'Cirurgia'),
  ('diagnostico-imagem',      'Diagnostico por Imagem',    'Aparelhos de raio-X, ultrassom e ecocardiografia para clinicas e hospitais veterinarios.', 3, 3, 1, 'Imagem'),
  ('laboratorio',             'Laboratorio',               'Analisadores hematologicos, bioquimicos e centrifugas para laboratorios veterinarios.', 4, 4, 0, 'Laboratorio'),
  ('terapia-intensiva',       'Terapia Intensiva',         'Incubadoras, ventiladores, bombas de infusao e desfibriladores para UTI veterinaria.', 5, 5, 1, 'UTI'),
  ('odontologia',             'Odontologia',               'Unidades odontologicas, ultrassom e instrumental para odontologia veterinaria.', 6, 6, 0, 'Odonto'),
  ('dermatologia',            'Dermatologia',              'Equipamentos de dermatoscopia e acessorios para dermatologia veterinaria.', 7, 7, 0, 'Dermato'),
  ('oftalmologia',            'Oftalmologia',              'Tonometros, oftalmoscopios e equipamentos para oftalmologia veterinaria.', 8, 8, 0, 'Oftalmo')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  descricao_curta = VALUES(descricao_curta),
  ordem = VALUES(ordem),
  destaque = VALUES(destaque);

-- ============================================================
-- SECTION 26: SEEDS - HOME_SECAO (8 secoes da home)
-- ============================================================
INSERT INTO home_secao (id, label, descricao, ordem, ativa, template, gerenciavel_admin) VALUES
  ('hero',         'Hero principal',         'Banner principal com titulo, subtitulo e CTAs.',                 1, 1, 'hero', 0),
  ('marquee_top',  'Faixa de marcas',        'Faixa rolante com logos das marcas representadas.',              2, 1, 'marquee', 0),
  ('categorias',   'Categorias',             'Grid das principais categorias de produtos.',                    3, 1, 'grid_categorias', 0),
  ('destaques',    'Produtos em destaque',   'Carrossel com produtos selecionados para destaque.',             4, 1, 'grid_produtos', 0),
  ('principios',   'Principios / Valores',   'Bloco com os pilares e diferenciais da Conecta Vision.',         5, 1, 'principios', 0),
  ('sobre',        'Sobre a Conecta',        'Resumo institucional com missao e visao.',                       6, 1, 'sobre', 0),
  ('depoimento',   'Depoimento',             'Depoimento de cliente ou parceiro estrategico.',                 7, 1, 'depoimento', 0),
  ('cta_final',    'CTA final',              'Chamada final de conversao para orcamento / contato.',           8, 1, 'banner_cta', 0)
ON DUPLICATE KEY UPDATE
  label = VALUES(label),
  descricao = VALUES(descricao),
  ordem = VALUES(ordem);

-- ============================================================
-- SECTION 27: SEEDS - CONFIGURACAO (28 chaves)
-- ============================================================
INSERT INTO configuracao (chave, valor, grupo, label) VALUES
  ('nome',                          'Conecta Vision',                'empresa', 'Razao social / nome da empresa'),
  ('nome_curto',                    'Conecta',                       'empresa', 'Nome curto usado em titulos'),
  ('cnpj',                          '',                              'empresa', 'CNPJ da empresa'),
  ('endereco',                      '',                              'empresa', 'Endereco completo da matriz'),
  ('cidade',                        '',                              'empresa', 'Cidade da matriz'),
  ('estado',                        '',                              'empresa', 'UF da matriz'),
  ('cep',                           '',                              'empresa', 'CEP da matriz'),
  ('missao',                        '',                              'empresa', 'Missao institucional'),
  ('visao',                         '',                              'empresa', 'Visao institucional'),
  ('email_comercial',               '',                              'contato', 'Email comercial principal'),
  ('email_suporte',                 '',                              'contato', 'Email de suporte / SAC'),
  ('telefone_principal',            '',                              'contato', 'Telefone formatado para exibicao'),
  ('telefone_principal_raw',        '',                              'contato', 'Telefone somente digitos (tel:)'),
  ('whatsapp',                      '',                              'contato', 'WhatsApp formatado para exibicao'),
  ('whatsapp_raw',                  '',                              'contato', 'WhatsApp somente digitos (wa.me)'),
  ('whatsapp_msg_padrao',           'Ola! Gostaria de mais informacoes.', 'contato', 'Mensagem pre-preenchida do WhatsApp'),
  ('horario_atendimento',           'Segunda a sexta, das 08h as 18h', 'contato', 'Horario de atendimento'),
  ('instagram',                     '',                              'redes',   'URL do Instagram'),
  ('facebook',                      '',                              'redes',   'URL do Facebook'),
  ('linkedin',                      '',                              'redes',   'URL do LinkedIn'),
  ('youtube',                       '',                              'redes',   'URL do canal no YouTube'),
  ('meta_titulo_global',            'Conecta Vision - Solucoes Veterinarias', 'seo', 'Titulo padrao (SEO)'),
  ('meta_descricao_global',         'Distribuidora de equipamentos veterinarios com solucoes em anestesia, cirurgia, imagem e laboratorio.', 'seo', 'Descricao padrao (SEO)'),
  ('palavras_chave',                'equipamentos veterinarios, anestesia veterinaria, ultrassom veterinario', 'seo', 'Palavras-chave globais'),
  ('og_imagem_url',                 '',                              'seo',     'URL da imagem padrao Open Graph'),
  ('google_analytics_id',           '',                              'seo',     'ID Google Analytics (GA4)'),
  ('google_search_console_token',   '',                              'seo',     'Token Search Console'),
  ('politica_privacidade_versao',   '1.0',                           'geral',   'Versao atual da politica de privacidade')
ON DUPLICATE KEY UPDATE
  label = VALUES(label),
  grupo = VALUES(grupo);

-- ============================================================
-- SECTION 28: SEEDS - CONTEUDO_ITEM (~15 textos default)
-- ============================================================
INSERT INTO conteudo_item (chave, valor, tipo, pagina, label, descricao, multiline) VALUES
  ('home.hero.titulo',         'Solucoes completas para a medicina veterinaria', 'texto', 'home',         'Hero: titulo',         'Titulo principal do hero da home.',                0),
  ('home.hero.subtitulo',      'Equipamentos, suporte e parcerias para clinicas e hospitais.', 'texto', 'home', 'Hero: subtitulo',     'Subtitulo / chamada do hero.',                     1),
  ('home.hero.cta_label',      'Solicitar orcamento',                            'texto', 'home',         'Hero: texto do CTA',   'Texto do botao principal do hero.',                0),
  ('home.destaques.titulo',    'Produtos em destaque',                           'texto', 'home',         'Destaques: titulo',    'Titulo da secao de produtos em destaque.',         0),
  ('home.categorias.titulo',   'Nossas categorias',                              'texto', 'home',         'Categorias: titulo',   'Titulo da secao de categorias na home.',           0),
  ('home.cta_final.titulo',    'Pronto para equipar sua clinica?',               'texto', 'home',         'CTA final: titulo',    'Titulo do bloco final de conversao.',              0),
  ('home.cta_final.texto',     'Fale com nosso time comercial e receba uma proposta personalizada.', 'texto', 'home', 'CTA final: texto', 'Texto do bloco final.',                            1),
  ('sobre.missao',             '',                                               'texto', 'sobre',        'Sobre: missao',        'Texto institucional da missao.',                   1),
  ('sobre.visao',              '',                                               'texto', 'sobre',        'Sobre: visao',         'Texto institucional da visao.',                    1),
  ('sobre.historia',           '',                                               'html',  'sobre',        'Sobre: historia',      'Bloco de historia / trajetoria.',                  1),
  ('contato.titulo',           'Fale com a Conecta',                             'texto', 'contato',      'Contato: titulo',      'Titulo da pagina de contato.',                     0),
  ('contato.subtitulo',        'Estamos prontos para atender sua clinica ou hospital.', 'texto', 'contato', 'Contato: subtitulo', 'Subtitulo da pagina de contato.',                  1),
  ('footer.copy',              'Conecta Vision - Todos os direitos reservados.', 'texto', 'footer',       'Footer: copyright',    'Linha de copyright do rodape.',                    0),
  ('privacidade.conteudo',     '',                                               'html',  'privacidade',  'Politica de Privacidade', 'Conteudo completo da pagina de privacidade.',     1),
  ('termos.conteudo',          '',                                               'html',  'termos',       'Termos de Uso',        'Conteudo completo da pagina de termos de uso.',    1)
ON DUPLICATE KEY UPDATE
  label = VALUES(label),
  descricao = VALUES(descricao);

-- ============================================================
-- SECTION 29: SEEDS - ADMIN_USER (CONTA BLOQUEADA - obriga reset)
-- ============================================================
-- ATENCAO (BLOQUEADOR QA #3):
-- A senha eh um hash INVALIDO ('!locked') que NUNCA fara match com bcrypt.compare().
-- Isso significa que o admin NAO PODE fazer login com este registro - eh apenas
-- um placeholder. A aplicacao DEVE expor um fluxo de "esqueci minha senha" ou
-- comando CLI para definir a senha real antes do primeiro acesso.
--
-- COMANDO de RESET sugerido (Node.js):
--   const bcrypt = require('bcrypt');
--   const hash = await bcrypt.hash('SUA_SENHA_FORTE', 12);
--   await db.execute('UPDATE admin_user SET senha_hash=?, forcar_troca_senha=0, senha_trocada_em=NOW() WHERE email=?',
--                    [hash, 'admin@conecta.com.br']);
--
-- CHECKLIST de GO-LIVE:
--   SELECT id FROM admin_user WHERE senha_hash = '!locked';
--   -> se retornar linha = ABORTAR deploy
-- ============================================================
INSERT INTO admin_user (email, senha_hash, nome, role, ativo, forcar_troca_senha)
VALUES ('admin@conecta.com.br', '!locked', 'Administrador Conecta', 'admin', 1, 1)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  ativo = VALUES(ativo);

-- ============================================================
-- FIM DO SCRIPT - schema 1.0.0
-- ============================================================
-- PROXIMOS PASSOS apos rodar este arquivo:
-- 1) Resetar senha do admin (ver SECTION 29)
-- 2) Configurar time_zone no my.cnf: default-time-zone='-03:00'
-- 3) Agendar jobs de retencao LGPD:
--    - Mensal: DELETE FROM audit_log WHERE criado_em < DATE_SUB(NOW(), INTERVAL 12 MONTH);
--    - Mensal: anonimizar formularios com status='perdido' > 24 meses
--    - Mensal: DELETE FROM admin_session WHERE expira_em < NOW();
--    - Mensal: DELETE FROM rate_limit WHERE janela_ini < DATE_SUB(NOW(), INTERVAL 7 DAY);
-- 4) Configurar backup diario do banco
-- 5) Validar plano de testes (ver db/TESTS.md)
-- ============================================================
