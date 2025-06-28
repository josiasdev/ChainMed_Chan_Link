-- ChainMed DPS - Database Schema
-- Sistema Anti-Fraude com endereços MetaMask obrigatórios

-- Tabela de usuários (todos devem ter endereço MetaMask)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    endereco_metamask VARCHAR(42) UNIQUE NOT NULL, -- Endereço MetaMask obrigatório
    hash_usuario VARCHAR(64) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_nascimento DATE NOT NULL,
    tipo_usuario VARCHAR(20) DEFAULT 'principal', -- 'principal' ou 'participante'
    responsavel_endereco VARCHAR(42), -- Endereço do responsável (se for participante)
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (responsavel_endereco) REFERENCES usuarios(endereco_metamask)
);

-- Tabela de seguradoras
CREATE TABLE IF NOT EXISTS seguradoras (
    id SERIAL PRIMARY KEY,
    endereco_metamask VARCHAR(42) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    autorizada BOOLEAN DEFAULT false,
    ativa BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de DPS (Declaração Pessoal de Saúde)
CREATE TABLE IF NOT EXISTS dps (
    id SERIAL PRIMARY KEY,
    hash_dps VARCHAR(64) UNIQUE NOT NULL,
    usuario_endereco VARCHAR(42) NOT NULL,
    responsavel_endereco VARCHAR(42) NOT NULL, -- Quem preencheu a DPS
    data_preenchimento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    respostas JSONB NOT NULL,
    hash_blockchain VARCHAR(66), -- Hash da transação na blockchain
    total_respostas_positivas INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_endereco) REFERENCES usuarios(endereco_metamask),
    FOREIGN KEY (responsavel_endereco) REFERENCES usuarios(endereco_metamask)
);

-- Tabela de consultas (auditoria anti-fraude)
CREATE TABLE IF NOT EXISTS consultas_dps (
    id SERIAL PRIMARY KEY,
    seguradora_endereco VARCHAR(42) NOT NULL,
    usuario_consultado_endereco VARCHAR(42) NOT NULL,
    tipo_busca VARCHAR(20) NOT NULL, -- 'hash' ou 'cpf'
    valor_busca VARCHAR(255) NOT NULL,
    resultado_encontrado BOOLEAN NOT NULL,
    ip_origem INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seguradora_endereco) REFERENCES seguradoras(endereco_metamask),
    FOREIGN KEY (usuario_consultado_endereco) REFERENCES usuarios(endereco_metamask)
);

-- Índices para otimização e busca anti-fraude
CREATE INDEX IF NOT EXISTS idx_usuarios_endereco ON usuarios(endereco_metamask);
CREATE INDEX IF NOT EXISTS idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX IF NOT EXISTS idx_usuarios_hash ON usuarios(hash_usuario);
CREATE INDEX IF NOT EXISTS idx_dps_usuario ON dps(usuario_endereco);
CREATE INDEX IF NOT EXISTS idx_dps_responsavel ON dps(responsavel_endereco);
CREATE INDEX IF NOT EXISTS idx_dps_hash ON dps(hash_dps);
CREATE INDEX IF NOT EXISTS idx_consultas_seguradora ON consultas_dps(seguradora_endereco);
CREATE INDEX IF NOT EXISTS idx_consultas_usuario ON consultas_dps(usuario_consultado_endereco);
CREATE INDEX IF NOT EXISTS idx_consultas_data ON consultas_dps(created_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
