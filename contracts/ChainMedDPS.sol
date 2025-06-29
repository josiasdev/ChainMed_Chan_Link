// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";


/**
 * @title ChainMedDPS - Anti-Fraud System
 * @dev Smart Contract optimized to prevent DPS fraud
 * @author ChainMed Team
 */
contract ChainMedDPS is Ownable, ReentrancyGuard, FunctionsClient, AutomationCompatibleInterface {
    using FunctionsRequest for FunctionsRequest.Request;

    // Custom errors
    error ChainMedDPS__UserNotActive();
    error ChainMedDPS__InsuranceNotAuthorized();
    error ChainMedDPS__DPSNotFound();
    error ChainMedDPS__NameCannotBeEmpty();
    error ChainMedDPS__UserAlreadyRegistered();
    error ChainMedDPS__HashAlreadyUsed();
    error ChainMedDPS__CPFAlreadyRegistered();
    error ChainMedDPS__UserDPSNotFound();
    error ChainMedDPS__NoPermissionToRegisterDPS();
    error ChainMedDPS__UserNotFound();
    error ChainMedDPS__InvalidAddress();

    // Estrutura para armazenar dados de registro de usuário pendentes
    struct PendingUserRegistration {
        address requester;
        string name;
        string cpfHash;
        string userHash;
    }

    // Estrutura para armazenar dados de autorização de seguradora pendentes
    struct PendingInsuranceAuthorization {
        address insuranceAddress;
        string name;
        string cnpj;
    }

    enum RequestType {
        NONE,
        USER_REGISTRATION,
        INSURANCE_AUTHORIZATION
    }

    // User structure
    struct User {
        string name;
        string cpfHash; // CPF hash for privacy
        string userHash;
        bool active;
        bool isParticipant;
        address responsible;
        uint256 registrationDate;
        uint256[] dpsIds;
    }
    
    // DPS structure
    struct DPS {
        uint256 id;
        address user;
        address responsible;
        string hashDPS;
        string encryptedData;
        uint256 timestamp;
        bool active;
        uint256 totalPositiveResponses;
    }
    
    // Insurance company structure
    struct Insurance {
        string name;
        string cnpj;
        bool authorized;
        uint256 registrationDate;
        uint256 queriesPerformed;
    }

    // DPS counter
    uint256 private s_dpsCounter;

    uint256 private s_userInactivePeriod;
    uint256 private s_dpsStalePeriod;

    // Main mappings
    mapping(address => User) private users;
    mapping(uint256 => DPS) private dpsRegistry;
    mapping(address => Insurance) private insurances;

    // Mappings for anti-fraud search
    mapping(string => address) private hashToAddress;
    mapping(string => address) private cpfHashToAddress;
    mapping(string => uint256[]) private hashToDPS;
    mapping(address => uint256[]) private addressToDPS;
    
    // Arrays for iteration
    address[] private usersList;
    address[] private insurancesList;

    // Chainlink Functions variables
    address public immutable i_functionsRouter;
    bytes32 public lastRequestId;
    bytes public lastResponse;
    bytes public lastError;
    uint64 public immutable i_subscriptionId;

    // Chainlink Automation variables
    uint256 private immutable i_interval;
    uint256 private lastTimestamp;

    // Mapeamentos para armazenar dados temporários das requisições
    mapping(bytes32 => RequestType) public requestTypes;
    mapping(bytes32 => PendingUserRegistration) public userRegistrationRequests;
    mapping(bytes32 => PendingInsuranceAuthorization) public insuranceAuthRequests;

    // Events
    event UserRegistered(
        address indexed userAddress,
        string userHash,
        string name,
        bool isParticipant,
        address indexed responsible,
        uint256 timestamp
    );
    
    event DPSRegistered(
        uint256 indexed dpsId,
        address indexed user,
        address indexed responsible,
        string hashDPS,
        uint256 positiveResponses,
        uint256 timestamp
    );
    
    event QueryPerformed(
        address indexed insurance,
        address indexed queriedUser,
        string queryType,
        uint256 timestamp
    );
    
    event InsuranceAuthorized(
        address indexed insurance,
        string name,
        string cnpj,
        uint256 timestamp
    );
    
    event UserRegistrationRequested(bytes32 indexed requestId, address requester, string userHash);
    event InsuranceVerificationRequested(bytes32 indexed requestId, address insurance, string cnpj);

    // Automation Events
    event UserDeactivated(address indexed user);
    event DPSDeactivated(uint256 indexed dpsId);

    // Modifiers
    modifier onlyActiveUser() {
        if (!users[msg.sender].active) {
            revert ChainMedDPS__UserNotActive();
        }
        _;
    }
    
    modifier onlyAuthorizedInsurance() {
        if (!insurances[msg.sender].authorized) {
            revert ChainMedDPS__InsuranceNotAuthorized();
        }
        _;
    }
    
    modifier dpsExists(uint256 _dpsId) {
        if (_dpsId > s_dpsCounter) {
            revert ChainMedDPS__DPSNotFound();
        }
        _;
    }
    
    constructor(
        address _functionsRouter,
        uint64 _subscriptionId,
        uint256 _updateInterval
    ) Ownable(msg.sender) FunctionsClient(_functionsRouter) {
        s_dpsCounter = 0;
        i_functionsRouter = _functionsRouter;
        i_subscriptionId = _subscriptionId;
        i_interval = _updateInterval;
        lastTimestamp = block.timestamp;
    }

    /**
     * @dev Requests new user registration and CPF verification via Chainlink Functions.
     * @param _name User's name.
     * @param _cpf The raw CPF string for off-chain verification. It will be hashed for on-chain storage.
     * @param _userHash A unique hash for the user.
     * @param _source The JavaScript source code for the Chainlink Function.
     */
    function requestUserRegistration(
        string memory _name,
        string memory _cpf,
        string memory _userHash,
        string memory _source
    ) external {
        string memory cpfHash = keccak256ToString(abi.encodePacked(_cpf));

        if (bytes(_name).length == 0) revert ChainMedDPS__NameCannotBeEmpty();
        if (users[msg.sender].active) revert ChainMedDPS__UserAlreadyRegistered();
        if (hashToAddress[_userHash] != address(0)) revert ChainMedDPS__HashAlreadyUsed();
        if (cpfHashToAddress[cpfHash] != address(0)) revert ChainMedDPS__CPFAlreadyRegistered();

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(_source);
        string[] memory args = new string[](1);
        args[0] = _cpf;
        req.setArgs(args); // Passa o CPF não-hasheado para o script JS

        bytes32 requestId = _sendRequest(req.encodeCBOR(), i_subscriptionId, 3e5, bytes32(0));

        requestTypes[requestId] = RequestType.USER_REGISTRATION;
        userRegistrationRequests[requestId] = PendingUserRegistration({
            requester: msg.sender,
            name: _name,
            cpfHash: cpfHash,
            userHash: _userHash
        });

        emit UserRegistrationRequested(requestId, msg.sender, _userHash);
    }

    /**
     * @dev Callback function for Chainlink Functions
     */
    function fulfillRequest(
        bytes32 _requestId,
        bytes memory _response,
        bytes memory _err
    ) internal override {
        if (_err.length > 0) {
            lastError = _err;
        } else {
            lastResponse = _response;
            RequestType reqType = requestTypes[_requestId];
            bool isValid = abi.decode(_response, (bool));

            if (isValid) {
                if (reqType == RequestType.USER_REGISTRATION) {
                    _completeUserRegistration(_requestId);
                } else if (reqType == RequestType.INSURANCE_AUTHORIZATION) {
                    _completeInsuranceAuthorization(_requestId);
                }
            }
        }
        // Limpa os dados da requisição após o processamento
        delete requestTypes[_requestId];
        delete userRegistrationRequests[_requestId];
        delete insuranceAuthRequests[_requestId];
    }

    function _completeUserRegistration(bytes32 _requestId) private {
        PendingUserRegistration memory pendingUser = userRegistrationRequests[_requestId];
        
        users[pendingUser.requester] = User({
            name: pendingUser.name,
            cpfHash: pendingUser.cpfHash,
            userHash: pendingUser.userHash,
            active: true,
            isParticipant: false,
            responsible: address(0),
            registrationDate: block.timestamp,
            dpsIds: new uint256[](0)
        });
        
        hashToAddress[pendingUser.userHash] = pendingUser.requester;
        cpfHashToAddress[pendingUser.cpfHash] = pendingUser.requester;
        usersList.push(pendingUser.requester);
        
        emit UserRegistered(pendingUser.requester, pendingUser.userHash, pendingUser.name, false, address(0), block.timestamp);
    }

    function _completeInsuranceAuthorization(bytes32 _requestId) private {
        PendingInsuranceAuthorization memory pendingAuth = insuranceAuthRequests[_requestId];
        insurances[pendingAuth.insuranceAddress] = Insurance({
            name: pendingAuth.name,
            cnpj: pendingAuth.cnpj,
            authorized: true,
            registrationDate: block.timestamp,
            queriesPerformed: 0
        });
        
        insurancesList.push(pendingAuth.insuranceAddress);
        emit InsuranceAuthorized(pendingAuth.insuranceAddress, pendingAuth.name, pendingAuth.cnpj, block.timestamp);
    }

    // Função auxiliar para converter bytes32 para string (necessária para o hash do CPF)
    function keccak256ToString(bytes memory data) private pure returns (string memory) {
        return string(abi.encodePacked(keccak256(data)));
    }

    /**
     * @dev Register main user
     */
    function registerMainUser(
        string memory _name,
        string memory _cpfHash,
        string memory _userHash
    ) external {
        if (bytes(_name).length == 0) {
            revert ChainMedDPS__NameCannotBeEmpty();
        }
        if (users[msg.sender].active) {
            revert ChainMedDPS__UserAlreadyRegistered();
        }
        if (hashToAddress[_userHash] != address(0)) {
            revert ChainMedDPS__HashAlreadyUsed();
        }
        if (cpfHashToAddress[_cpfHash] != address(0)) {
            revert ChainMedDPS__CPFAlreadyRegistered();
        }
        
        users[msg.sender] = User({
            name: _name,
            cpfHash: _cpfHash,
            userHash: _userHash,
            active: true,
            isParticipant: false,
            responsible: address(0),
            registrationDate: block.timestamp,
            dpsIds: new uint256[](0)
        });
        
        hashToAddress[_userHash] = msg.sender;
        cpfHashToAddress[_cpfHash] = msg.sender;
        usersList.push(msg.sender);
        
        emit UserRegistered(msg.sender, _userHash, _name, false, address(0), block.timestamp);
    }
    
    /**
     * @dev Register DPS
     */
    function registerDPS(
        address _userDPS,
        string memory _hashDPS,
        string memory _encryptedData,
        uint256 _positiveResponses
    ) external nonReentrant onlyActiveUser {
        if (!users[_userDPS].active) {
            revert ChainMedDPS__UserDPSNotFound();
        }
        if (_userDPS != msg.sender && users[_userDPS].responsible != msg.sender) {
            revert ChainMedDPS__NoPermissionToRegisterDPS();
        }
        
        uint256 dpsId = s_dpsCounter;
        
        dpsRegistry[dpsId] = DPS({
            id: dpsId,
            user: _userDPS,
            responsible: msg.sender,
            hashDPS: _hashDPS,
            encryptedData: _encryptedData,
            timestamp: block.timestamp,
            active: true,
            totalPositiveResponses: _positiveResponses
        });
        
        users[_userDPS].dpsIds.push(dpsId);
        hashToDPS[users[_userDPS].userHash].push(dpsId);
        addressToDPS[_userDPS].push(dpsId);
        
        s_dpsCounter++;
        
        emit DPSRegistered(dpsId, _userDPS, msg.sender, _hashDPS, _positiveResponses, block.timestamp);
    }
    
    /**
     * @dev Query DPS by hash (insurance companies)
     */
    function queryDPSByHash(
        string memory _userHash
    ) external onlyAuthorizedInsurance returns (uint256[] memory) {
        address userAddress = hashToAddress[_userHash];
        if (userAddress == address(0)) {
            revert ChainMedDPS__UserNotFound();
        }
        
        insurances[msg.sender].queriesPerformed++;
        
        emit QueryPerformed(msg.sender, userAddress, "hash", block.timestamp);
        
        return hashToDPS[_userHash];
    }
    
    /**
     * @dev Query DPS by CPF (insurance companies)
     */
    function queryDPSByCPF(
        string memory _cpfHash
    ) external onlyAuthorizedInsurance returns (uint256[] memory) {
        address userAddress = cpfHashToAddress[_cpfHash];
        if (userAddress == address(0)) {
            revert ChainMedDPS__UserNotFound();
        }
        
        insurances[msg.sender].queriesPerformed++;
        
        emit QueryPerformed(msg.sender, userAddress, "cpf", block.timestamp);
        
        return addressToDPS[userAddress];
    }
    
    /**
     * @dev Get DPS details
     */
    function getDPS(uint256 _dpsId) 
        external 
        view 
        onlyAuthorizedInsurance 
        dpsExists(_dpsId) 
        returns (
            uint256 id,
            address user,
            address responsible,
            string memory hashDPS,
            string memory encryptedData,
            uint256 timestamp,
            bool active,
            uint256 positiveResponses
        ) 
    {
        DPS memory dps = dpsRegistry[_dpsId];
        return (
            dps.id,
            dps.user,
            dps.responsible,
            dps.hashDPS,
            dps.encryptedData,
            dps.timestamp,
            dps.active,
            dps.totalPositiveResponses
        );
    }
    
    /**
     * @dev Authorize insurance company (owner only)
     */
    function authorizeInsurance(
        address _insurance,
        string memory _name,
        string memory _cnpj
    ) external onlyOwner {
        if (_insurance == address(0)) {
            revert ChainMedDPS__InvalidAddress();
        }
        
        insurances[_insurance] = Insurance({
            name: _name,
            cnpj: _cnpj,
            authorized: true,
            registrationDate: block.timestamp,
            queriesPerformed: 0
        });
        
        insurancesList.push(_insurance);
        
        emit InsuranceAuthorized(_insurance, _name, _cnpj, block.timestamp);
    }
    
    /**
     * @dev Check if user exists by hash
     */
    function userExistsByHash(string memory _userHash) external view returns (bool) {
        return hashToAddress[_userHash] != address(0);
    }
    
    /**
     * @dev Check if user exists by CPF
     */
    function userExistsByCPF(string memory _cpfHash) external view returns (bool) {
        return cpfHashToAddress[_cpfHash] != address(0);
    }
    
    /**
     * @dev Get general statistics
     */
    function getStatistics() 
        external 
        view 
        onlyOwner 
        returns (
            uint256 totalUsers,
            uint256 totalDPS,
            uint256 totalInsurances
        ) 
    {
        return (
            usersList.length,
            s_dpsCounter,
            insurancesList.length
        );
    }

    /**
     * @dev Chainlink Automation - checks if the upkeep is needed.
     *      This function is called by the Chainlink Automation network to determine
     *      if performUpkeep should be executed.
     */
    function checkUpkeep(
        bytes memory /* checkData */
    ) public view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastTimestamp) > i_interval;
        // No performData is needed, so we return an empty bytes array.
    }

    /**
     * @dev Chainlink Automation - performs the upkeep.
     *      This function deactivates inactive users and old DPS records.
     *      WARNING: This function iterates over all users. For a very large number of
     *      users, this could exceed the block gas limit. For production systems with
     *      thousands of users, consider a batch processing pattern.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        // Re-check the condition to ensure it's still valid when performUpkeep is executed.
        if ((block.timestamp - lastTimestamp) > i_interval) {
            lastTimestamp = block.timestamp;

            // Loop through all registered users
            for (uint256 i = 0; i < usersList.length; i++) {
                address userAddress = usersList[i];
                User storage currentUser = users[userAddress];

                // 1. Deactivate inactive users
                // Condition: User is active, registered for over a year, and has no DPS records.
                if (
                    currentUser.active &&
                    (block.timestamp - currentUser.registrationDate) > s_userInactivePeriod &&
                    currentUser.dpsIds.length == 0
                ) {
                    currentUser.active = false;
                    emit UserDeactivated(userAddress);
                }
            }

            // 2. Deactivate stale DPS records
            for (uint256 i = 0; i < s_dpsCounter; i++) {
                DPS storage dps = dpsRegistry[i];

                // Condition: DPS is active and older than two years.
                if (dps.active && (block.timestamp - dps.timestamp) > s_dpsStalePeriod) {
                    dps.active = false;
                    emit DPSDeactivated(i);
                }
            }
        }
    }
}
