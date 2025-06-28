-- ChainMed DPS - Dados de Teste
-- Inserir dados de exemplo para desenvolvimento e testes

-- Inserir seguradoras de exemplo
INSERT INTO seguradoras (endereco_metamask, nome, cnpj, email, api_key, autorizada) VALUES
('0x742d35Cc6634C0532925a3b8D4C9db96590c6C87', 'Seguradora Saúde Total', '12345678000195', 'api@saudetotal.com.br', 'sk_test_1234567890abcdef', true),
('0x8ba1f109551bD432803012645Hac136c30C85Bb1', 'MedCare Seguros', '98765432000187', 'api@medcare.com.br', 'sk_test_abcdef1234567890', true),
('0x9Cc9a2b33D80b5E6Aa0B3b45C4d5e6f7890abcde', 'Vida Plena Seguros', '11223344000156', 'api@vidaplena.com.br', 'sk_test_fedcba0987654321', true)
ON CONFLICT (endereco_metamask) DO NOTHING;

-- Inserir usuários de exemplo
INSERT INTO usuarios (endereco_metamask, hash_usuario, nome, cpf, email, telefone, data_nascimento, tipo_usuario) VALUES
('0xa1b2c3d4e5f6789012345678901234567890abcd', 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', 'João Silva Santos', '12345678901', 'joao@email.com', '11999887766', '1985-03-15', 'principal'),
('0xb2c3d4e5f6789012345678901234567890abcdef', 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a', 'Maria Oliveira Costa', '98765432109', 'maria@email.com', '11888776655', '1990-07-22', 'principal'),
('0xc3d4e5f6789012345678901234567890abcdef12', 'c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2', 'Pedro Almeida Lima', '11122233344', 'pedro@email.com', '11777665544', '1978-12-08', 'principal')
ON CONFLICT (endereco_metamask) DO NOTHING;

-- Inserir DPS de exemplo
INSERT INTO dps (hash_dps, usuario_endereco, responsavel_endereco, respostas, total_respostas_positivas) VALUES
('dps_abc123def456', '0xa1b2c3d4e5f6789012345678901234567890abcd', '0xa1b2c3d4e5f6789012345678901234567890abcd', 
 '{"1": {"resposta": "Sim", "detalhes": "Hipertensão controlada com medicamento"}, "2": {"resposta": "Não"}}', 1),
('dps_def456ghi789', '0xb2c3d4e5f6789012345678901234567890abcdef', '0xb2c3d4e5f6789012345678901234567890abcdef',
 '{"20": {"resposta": "Sim", "detalhes": "Grávida de 6 meses"}}', 1)
ON CONFLICT (hash_dps) DO NOTHING;
