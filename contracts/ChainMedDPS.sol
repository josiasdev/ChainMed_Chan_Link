// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ChainMedDPS - Sistema Anti-Fraude
 * @dev Smart Contract otimizado para prevenir fraudes em DPS
 * @author ChainMed Team
 */
contract ChainMedDPS is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _dpsCounter;
    
    // Estrutura para usuários
    struct Usuario {
        string nome;
        string cpfHash; // Hash do CPF para privacidade
        string hashUsuario;
        bool ativo;
        bool ehParticipante;
        address responsavel;
        uint256 dataCadastro;
        uint256[] dpsIds;
    }
    
    // Estrutura para DPS
    struct DPS {
        uint256 id;
        address usuario;
        address responsavel;
        string hashDPS;
        string dadosCriptografados;
        uint256 timestamp;
        bool ativa;
        uint256 totalRespostasPositivas;
    }
    
    // Estrutura para seguradoras
    struct Seguradora {
        string nome;
        string cnpj;
        bool autorizada;
        uint256 dataCadastro;
        uint256 consultasRealizadas;
    }
    
    // Mappings principais
    mapping(address => Usuario) public usuarios;
    mapping(uint256 => DPS) public dpsRegistry;
    mapping(address => Seguradora) public seguradoras;
    
    // Mappings para busca anti-fraude
    mapping(string => address) public hashToAddress;
    mapping(string => address) public cpfHashToAddress;
    mapping(string => uint256[]) public hashToDPS;
    mapping(address => uint256[]) public addressToDPS;
    
    // Arrays para iteração
    address[] public usuariosList;
    address[] public seguradorasList;
    
    // Eventos
    event UsuarioCadastrado(
        address indexed endereco,
        string hashUsuario,
        string nome,
        bool ehParticipante,
        address indexed responsavel,
        uint256 timestamp
    );
    
    event DPSRegistrada(
        uint256 indexed dpsId,
        address indexed usuario,
        address indexed responsavel,
        string hashDPS,
        uint256 respostasPositivas,
        uint256 timestamp
    );
    
    event ConsultaRealizada(
        address indexed seguradora,
        address indexed usuarioConsultado,
        string tipoConsulta,
        uint256 timestamp
    );
    
    // Modificadores
    modifier apenasUsuarioAtivo() {
        require(usuarios[msg.sender].ativo, "Usuario nao esta ativo");
        _;
    }
    
    modifier apenasSeguradoraAutorizada() {
        require(seguradoras[msg.sender].autorizada, "Seguradora nao autorizada");
        _;
    }
    
    modifier dpsExiste(uint256 _dpsId) {
        require(_dpsId > 0 && _dpsId <= _dpsCounter.current(), "DPS nao existe");
        _;
    }
    
    constructor() {
        _dpsCounter.increment();
    }
    
    /**
     * @dev Cadastrar usuário principal
     */
    function cadastrarUsuarioPrincipal(
        string memory _nome,
        string memory _cpfHash,
        string memory _hashUsuario
    ) external {
        require(bytes(_nome).length > 0, "Nome nao pode ser vazio");
        require(!usuarios[msg.sender].ativo, "Usuario ja cadastrado");
        require(hashToAddress[_hashUsuario] == address(0), "Hash ja utilizado");
        require(cpfHashToAddress[_cpfHash] == address(0), "CPF ja cadastrado");
        
        usuarios[msg.sender] = Usuario({
            nome: _nome,
            cpfHash: _cpfHash,
            hashUsuario: _hashUsuario,
            ativo: true,
            ehParticipante: false,
            responsavel: address(0),
            dataCadastro: block.timestamp,
            dpsIds: new uint256[](0)
        });
        
        hashToAddress[_hashUsuario] = msg.sender;
        cpfHashToAddress[_cpfHash] = msg.sender;
        usuariosList.push(msg.sender);
        
        emit UsuarioCadastrado(msg.sender, _hashUsuario, _nome, false, address(0), block.timestamp);
    }
    
    /**
     * @dev Registrar DPS
     */
    function registrarDPS(
        address _usuarioDPS,
        string memory _hashDPS,
        string memory _dadosCriptografados,
        uint256 _respostasPositivas
    ) external apenasUsuarioAtivo nonReentrant {
        require(usuarios[_usuarioDPS].ativo, "Usuario da DPS nao existe");
        require(
            _usuarioDPS == msg.sender || usuarios[_usuarioDPS].responsavel == msg.sender,
            "Sem permissao para registrar DPS deste usuario"
        );
        
        uint256 dpsId = _dpsCounter.current();
        
        dpsRegistry[dpsId] = DPS({
            id: dpsId,
            usuario: _usuarioDPS,
            responsavel: msg.sender,
            hashDPS: _hashDPS,
            dadosCriptografados: _dadosCriptografados,
            timestamp: block.timestamp,
            ativa: true,
            totalRespostasPositivas: _respostasPositivas
        });
        
        usuarios[_usuarioDPS].dpsIds.push(dpsId);
        hashToDPS[usuarios[_usuarioDPS].hashUsuario].push(dpsId);
        addressToDPS[_usuarioDPS].push(dpsId);
        
        _dpsCounter.increment();
        
        emit DPSRegistrada(dpsId, _usuarioDPS, msg.sender, _hashDPS, _respostasPositivas, block.timestamp);
    }
    
    /**
     * @dev Consultar DPS por hash (seguradoras)
     */
    function consultarDPSPorHash(
        string memory _hashUsuario
    ) external apenasSeguradoraAutorizada returns (uint256[] memory) {
        address usuarioEndereco = hashToAddress[_hashUsuario];
        require(usuarioEndereco != address(0), "Usuario nao encontrado");
        
        seguradoras[msg.sender].consultasRealizadas++;
        
        emit ConsultaRealizada(msg.sender, usuarioEndereco, "hash", block.timestamp);
        
        return hashToDPS[_hashUsuario];
    }
    
    /**
     * @dev Consultar DPS por CPF (seguradoras)
     */
    function consultarDPSPorCPF(
        string memory _cpfHash
    ) external apenasSeguradoraAutorizada returns (uint256[] memory) {
        address usuarioEndereco = cpfHashToAddress[_cpfHash];
        require(usuarioEndereco != address(0), "Usuario nao encontrado");
        
        seguradoras[msg.sender].consultasRealizadas++;
        
        emit ConsultaRealizada(msg.sender, usuarioEndereco, "cpf", block.timestamp);
        
        return addressToDPS[usuarioEndereco];
    }
    
    /**
     * @dev Obter detalhes de uma DPS
     */
    function obterDPS(uint256 _dpsId) 
        external 
        view 
        apenasSeguradoraAutorizada 
        dpsExiste(_dpsId) 
        returns (
            uint256 id,
            address usuario,
            address responsavel,
            string memory hashDPS,
            string memory dadosCriptografados,
            uint256 timestamp,
            bool ativa,
            uint256 respostasPositivas
        ) 
    {
        DPS memory dps = dpsRegistry[_dpsId];
        return (
            dps.id,
            dps.usuario,
            dps.responsavel,
            dps.hashDPS,
            dps.dadosCriptografados,
            dps.timestamp,
            dps.ativa,
            dps.totalRespostasPositivas
        );
    }
    
    /**
     * @dev Autorizar seguradora (apenas owner)
     */
    function autorizarSeguradora(
        address _seguradora,
        string memory _nome,
        string memory _cnpj
    ) external onlyOwner {
        require(_seguradora != address(0), "Endereco invalido");
        
        seguradoras[_seguradora] = Seguradora({
            nome: _nome,
            cnpj: _cnpj,
            autorizada: true,
            dataCadastro: block.timestamp,
            consultasRealizadas: 0
        });
        
        seguradorasList.push(_seguradora);
    }
    
    /**
     * @dev Verificar se usuário existe por hash
     */
    function usuarioExistePorHash(string memory _hashUsuario) external view returns (bool) {
        return hashToAddress[_hashUsuario] != address(0);
    }
    
    /**
     * @dev Verificar se usuário existe por CPF
     */
    function usuarioExistePorCPF(string memory _cpfHash) external view returns (bool) {
        return cpfHashToAddress[_cpfHash] != address(0);
    }
    
    /**
     * @dev Obter estatísticas gerais
     */
    function obterEstatisticas() 
        external 
        view 
        onlyOwner 
        returns (
            uint256 totalUsuarios,
            uint256 totalDPS,
            uint256 totalSeguradoras
        ) 
    {
        return (
            usuariosList.length,
            _dpsCounter.current() - 1,
            seguradorasList.length
        );
    }
}
