export type Language = "pt" | "en"

export interface Translations {
  // DPS
  dps: {
    newStatement: string
    informYourData: string
    selectDpsToFill: string
    choosePersonToFillDps: string
    answerHealthQuestionnaire: string
    reviewAllInformation: string
    responsibleData: string
    additionalParticipants: string
    noParticipantsAdded: string
    addFamilyMembers: string
    youWillAnswer: string
    allWillBeRegistered: string
    newUsersWillReceive: string
    selectPersonToFillDpsFirst: string
    youNeedToAnswer: string
    answeringFor: string
    responsible: string
    participant: string
    question: string
    additionalDetails: string
    provideAdditionalDetails: string
    dpsSummary: string
    participants: string
    questionnairesAnswered: string
    completeQuestionnaire: string
    questionsEach: string
    finalizeDps: string
    selectDpsToContinue: string
    successMessage: string
    processParticipantsError: string
    yourFullName: string
  }

  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    continue: string
    back: string
    next: string
    save: string
    delete: string
    edit: string
    view: string
    search: string
    connect: string
    disconnect: string
    yes: string
    no: string
    notApplicable: string
    progress: string
    completed: string
    confirmation: string
    attention: string
    processing: string
    previous: string
    answered: string
    pending: string
    with: string
    of: string
    fullName: string
    name: string
    phone: string
    birthDate: string
    addParticipant: string
  }

  // Navigation
  nav: {
    home: string
    login: string
    register: string
    dashboard: string
    newDPS: string
    familyDPS: string
    insuranceAccess: string
    apiDocs: string
  }

  // Homepage
  homepage: {
    title: string
    subtitle: string
    description: string
    fillDPS: string
    insuranceAccess: string
    blockchainSecurity: string
    blockchainSecurityDesc: string
    blockchainSecurityText: string
    antiFraud: string
    antiFraudDesc: string
    antiFraudText: string
    familyManagement: string
    familyManagementDesc: string
    familyManagementText: string
    footer: string
  }

  // Login
  login: {
    title: string
    subtitle: string
    userLogin: string
    insuranceLogin: string
    connectMetaMask: string
    connecting: string
    accessDashboard: string
    requirements: string
    requirementsList: string[]
    noAccount: string
    getTestETH: string
    corporateAccess: string
    corporateAccessDesc: string
    registerInsurance: string
    walletConnected: string
    metamaskInstalled: string
    metamaskNotInstalled: string
    sepoliaConnected: string
    sepoliaDisconnected: string
  }

  // Register
  register: {
    title: string
    createAccount: string
    userRegister: string
    insuranceRegister: string
    fullName: string
    cpf: string
    email: string
    phone: string
    birthDate: string
    password: string
    confirmPassword: string
    companyName: string
    cnpj: string
    technicalResponsible: string
    corporateEmail: string
    acceptTerms: string
    termsOfUse: string
    privacyPolicy: string
    createAccount: string
    registerInsurance: string
    alreadyHaveAccount: string
    afterRegistration: string
    afterRegistrationList: string[]
    creating: string
    registering: string
  }

  // Dashboard
  dashboard: {
    title: string
    subtitle: string
    newDPS: string
    newDPSDesc: string
    familyDPS: string
    familyDPSDesc: string
    dpsHistory: string
    dpsHistoryDesc: string
    noDPSFound: string
    noDPSFoundDesc: string
    fillFirstDPS: string
    participants: string
    conditions: string
    active: string
    inactive: string
    records: string
    totalDPS: string
    totalParticipants: string
    activeDPS: string
  }

  // DPS Questions
  dpsQuestions: {
    questions: string[]
    detailsLabel: string[]
  }

  // Insurance
  insurance: {
    title: string
    subtitle: string
    searchDPS: string
    searchDesc: string
    searchType: string
    userHash: string
    cpfNumbers: string
    search: string
    searching: string
    examples: string
    clickToFill: string
    fraudAlert: string
    risk: string
    clientInfo: string
    verified: string
    name: string
    birthDate: string
    statistics: string
    totalDPS: string
    conditions: string
    dpsHistory: string
    declaredConditions: string
    noConditions: string
    answer: string
    details: string
    userNotFound: string
    userNotFoundDesc: string
    insurancePanel: string
  }

  // API
  api: {
    title: string
    subtitle: string
    baseURL: string
    authentication: string
    format: string
    endpoints: string
    authTab: string
    testingTab: string
    examplesTab: string
    queryParams: string
    headers: string
    requestExample: string
    successResponse: string
    errorCodes: string
    getAPIKey: string
    testKeys: string
    useAPIKey: string
    interactiveTest: string
    testDesc: string
    apiResponse: string
    testAPI: string
    testing: string
  }

  // Errors
  errors: {
    passwordMismatch: string
    acceptTerms: string
    fillRequired: string
    connectionError: string
    userExists: string
    invalidCredentials: string
    networkError: string
    unknownError: string
  }

  // DPS Form
  dpsForm: {
    title: string
    subtitle: string
    personalData: string
    responsible: string
    additionalParticipants: string
    addParticipant: string
    removeParticipant: string
    noParticipants: string
    noParticipantsDesc: string
    familyNote: string
    familyNoteList: string[]
    progress: string
    completed: string
    dataAndParticipants: string
    selectDPS: string
    questionnaire: string
    confirmation: string
    participantNumber: string
    question: string
    of: string
    respondingFor: string
    participant: string
    summary: string
    questionnairesCompleted: string
    questionnairesCompletedDesc: string
    finalizeDPS: string
    processing: string
    selectDPSToContinue: string
    fillQuestionnaire: string
    answered: string
    pending: string
    important: string
    attention: string
    attentionList: string[]
  }
}

const translations: Record<Language, Translations> = {
  pt: {
    dps: {
      newStatement: "Nova Declaração Pessoal de Saúde",
      informYourData: "Informe seus dados e adicione participantes se necessário",
      selectDpsToFill: "Selecionar DPS para Preencher",
      choosePersonToFillDps: "Escolha de qual pessoa você quer preencher a DPS primeiro",
      answerHealthQuestionnaire: "Responda o questionário de saúde",
      reviewAllInformation: "Revise todas as informações antes de finalizar",
      responsibleData: "Dados do Responsável",
      additionalParticipants: "Participantes Adicionais",
      noParticipantsAdded: "Nenhum participante adicionado",
      addFamilyMembers: "Você pode adicionar familiares para preencher suas DPS junto com a sua",
      youWillAnswer: "Você responderá o questionário para cada participante",
      allWillBeRegistered: "Todos serão cadastrados automaticamente na blockchain",
      newUsersWillReceive: "Novos usuários receberão seus hashes por email",
      selectPersonToFillDpsFirst: "Selecione de qual pessoa você quer preencher a DPS primeiro",
      youNeedToAnswer: "Você precisará responder o questionário completo para cada participante",
      answeringFor: "Respondendo para",
      responsible: "Responsável",
      participant: "Participante",
      question: "Pergunta",
      additionalDetails: "Detalhes adicionais",
      provideAdditionalDetails: "Forneça detalhes adicionais...",
      dpsSummary: "Resumo da DPS",
      participants: "Participantes",
      questionnairesAnswered: "Questionários Respondidos",
      completeQuestionnaire: "questionário(s) completo(s)",
      questionsEach: "perguntas cada",
      finalizeDps: "Finalizar DPS",
      selectDpsToContinue: "Selecione uma DPS para continuar",
      successMessage: "DPS registrada com sucesso na blockchain!",
      processParticipantsError: "Erro ao processar participantes. Continuando sem Web3...",
      yourFullName: "Seu nome completo",
    },

    common: {
      loading: "Carregando...",
      error: "Erro",
      success: "Sucesso",
      cancel: "Cancelar",
      continue: "Continuar",
      back: "Voltar",
      next: "Próximo",
      save: "Salvar",
      delete: "Excluir",
      edit: "Editar",
      view: "Visualizar",
      search: "Buscar",
      connect: "Conectar",
      disconnect: "Desconectar",
      yes: "Sim",
      no: "Não",
      notApplicable: "Não se aplica",
      progress: "Progresso",
      completed: "concluído",
      confirmation: "Confirmação",
      attention: "Atenção",
      processing: "Processando...",
      previous: "Anterior",
      answered: "Respondido",
      pending: "Pendente",
      with: "com",
      of: "de",
      fullName: "Nome Completo",
      name: "Nome",
      phone: "Telefone",
      birthDate: "Data de Nascimento",
      addParticipant: "Adicionar Participante",
    },
    nav: {
      home: "Início",
      login: "Login",
      register: "Cadastrar",
      dashboard: "Dashboard",
      newDPS: "Nova DPS",
      familyDPS: "DPS Familiar",
      insuranceAccess: "Acesso Seguradora",
      apiDocs: "API Docs",
    },
    homepage: {
      title: "Portal DPS Blockchain",
      subtitle: "ChainMed",
      description:
        "Sistema seguro e transparente para Declaração Pessoal de Saúde, eliminando fraudes e centralizando informações médicas com tecnologia blockchain.",
      fillDPS: "Preencher DPS",
      insuranceAccess: "Acesso Seguradora",
      blockchainSecurity: "Segurança Blockchain",
      blockchainSecurityDesc: "Dados protegidos por hash SHA-256 e tecnologia blockchain",
      blockchainSecurityText:
        "Cada DPS é protegida por hash único, garantindo integridade e impossibilitando alterações fraudulentas.",
      antiFraud: "Anti-Fraude",
      antiFraudDesc: "Sistema centralizado previne declarações duplicadas",
      antiFraudText: "Seguradoras podem verificar histórico completo de DPS do usuário, eliminando omissões e fraudes.",
      familyManagement: "Gestão Familiar",
      familyManagementDesc: "Preencha DPS para toda a família em um só lugar",
      familyManagementText: "Responsável familiar pode gerenciar DPS de todos os membros, simplificando o processo.",
      footer: "© 2024 ChainMed. Todos os direitos reservados. Sistema em conformidade com ANS.",
    },
    login: {
      title: "Acesso via Blockchain Sepolia",
      subtitle: "ChainMed",
      userLogin: "Login de Usuário",
      insuranceLogin: "Login de Seguradora",
      connectMetaMask: "Conectar MetaMask",
      connecting: "Conectando...",
      accessDashboard: "Acessar Dashboard",
      requirements: "Requisitos para acesso:",
      requirementsList: [
        "MetaMask instalado e configurado",
        "Carteira conectada à rede Sepolia",
        "ETH de teste para transações",
        "Cadastro prévio na blockchain",
      ],
      noAccount: "Não tem conta? Cadastre-se",
      getTestETH: "Obter ETH de teste (Faucet)",
      corporateAccess: "Acesso Corporativo:",
      corporateAccessDesc:
        "Seguradoras devem usar carteiras corporativas autorizadas pela ChainMed. Entre em contato com o suporte para autorização.",
      registerInsurance: "Registrar nova seguradora",
      walletConnected: "Carteira Conectada",
      metamaskInstalled: "Instalado",
      metamaskNotInstalled: "Não Instalado",
      sepoliaConnected: "Conectado",
      sepoliaDisconnected: "Desconectado",
    },
    register: {
      title: "Criar nova conta",
      createAccount: "Criar Conta",
      userRegister: "Cadastro de Usuário",
      insuranceRegister: "Cadastro de Seguradora",
      fullName: "Nome Completo",
      cpf: "CPF",
      email: "E-mail",
      phone: "Telefone",
      birthDate: "Data de Nascimento",
      password: "Senha",
      confirmPassword: "Confirmar Senha",
      companyName: "Nome da Empresa",
      cnpj: "CNPJ",
      technicalResponsible: "Responsável Técnico",
      corporateEmail: "E-mail Corporativo",
      acceptTerms: "Aceito os",
      termsOfUse: "termos de uso",
      privacyPolicy: "política de privacidade",
      createAccount: "Criar Conta",
      registerInsurance: "Registrar Seguradora",
      alreadyHaveAccount: "Já tem conta? Faça login",
      afterRegistration: "Após o cadastro você receberá:",
      afterRegistrationList: [
        "API Key única para integração",
        "Documentação técnica completa",
        "Acesso ao dashboard de consultas",
        "Suporte técnico especializado",
      ],
      creating: "Cadastrando...",
      registering: "Registrando...",
    },
    dashboard: {
      title: "Meu Dashboard DPS",
      subtitle: "Gerencie suas Declarações Pessoais de Saúde registradas na blockchain Sepolia",
      newDPS: "Nova DPS",
      newDPSDesc: "Preencher nova Declaração Pessoal de Saúde",
      familyDPS: "DPS Familiar",
      familyDPSDesc: "Preencher DPS para familiares",
      dpsHistory: "Histórico de DPS",
      dpsHistoryDesc: "Todas as suas declarações registradas na blockchain",
      noDPSFound: "Nenhuma DPS encontrada",
      noDPSFoundDesc: "Você ainda não preencheu nenhuma Declaração Pessoal de Saúde.",
      fillFirstDPS: "Preencher primeira DPS",
      participants: "participante(s)",
      conditions: "condição(ões)",
      active: "Ativa",
      inactive: "Inativa",
      records: "registros",
      totalDPS: "DPS Registradas",
      totalParticipants: "Total de Participantes",
      activeDPS: "DPS Ativas",
    },
    dpsQuestions: {
      questions: [
        "Você é portador(a) de hipertensão arterial?",
        "No caso de gestante, tem história de doença hipertensiva específica da gravidez?",
        "Você possui alguma doença de pele (tumores, manchas, etc.)?",
        "Você tem alguma deficiência física (ex.: malformação congênita, síndromes genéticas)?",
        "Já foi diagnosticado(a) com câncer (neoplasia maligna)?",
        "Já fez quimioterapia ou radioterapia?",
        "Você possui obesidade mórbida?",
        "Tem alguma doença muscular (ex.: miastenia grave)?",
        "Já foi diagnosticado(a) com alguma doença infectocontagiosa (ex.: Chagas, tuberculose, meningite)?",
        "Você é portador(a) do vírus HIV (AIDS)?",
        "Tem alguma doença das glândulas endócrinas (ex.: tireoide, paratireoide, hipófise, suprarrenal)?",
        "Possui alguma enfermidade venosa (ex.: varizes, trombose, úlcera de perna)?",
        "Você tem algum transtorno psiquiátrico ou doença mental?",
        "Apresenta sequelas decorrentes de acidente (ex.: trauma com lesão residual)?",
        "Existe indicação médica para algum tipo de cirurgia futura?",
        "Já foi internado(a) ou operado(a) anteriormente?",
        "Faz uso contínuo de algum medicamento?",
        "Possui doenças crônicas (como diabetes, asma, artrite)?",
        "Já foi submetido(a) a exames diagnósticos (como tomografia, ressonância, endoscopia)?",
        "Está grávida atualmente ou nos últimos 12 meses? (se aplicável a mulheres em idade fértil)",
      ],
      detailsLabel: [
        "Detalhes adicionais",
        "Detalhes adicionais",
        "Especificar local",
        "Detalhes adicionais",
        "Informe o ano do diagnóstico",
        "Informar detalhes",
        "Detalhes adicionais",
        "Detalhes adicionais",
        "Descrever",
        "Detalhes adicionais",
        "Especificar",
        "Detalhes adicionais",
        "Detalhes adicionais",
        "Detalhes adicionais",
        "Qual?",
        "Informar motivos e datas",
        "Listar quais e para qual condição",
        "Detalhar diagnóstico",
        "Quais e quando",
        "Detalhes adicionais",
      ],
    },
    insurance: {
      title: "Dashboard Seguradora",
      subtitle: "Sistema Anti-Fraude - Consulte DPS por Hash ou CPF",
      searchDPS: "Consultar DPS",
      searchDesc: "Busque por hash único ou CPF para verificar histórico de DPS",
      searchType: "Tipo de Busca",
      userHash: "Hash do Usuário",
      cpfNumbers: "CPF (apenas números)",
      search: "Buscar",
      searching: "Buscando...",
      examples: "Exemplos para teste:",
      clickToFill: "Clique para preencher automaticamente",
      fraudAlert: "ALERTA ANTI-FRAUDE",
      risk: "Risco:",
      clientInfo: "Informações do Cliente",
      verified: "Verificado",
      name: "Nome",
      birthDate: "Data de Nascimento",
      statistics: "Estatísticas",
      totalDPS: "Total DPS",
      conditions: "Condições",
      dpsHistory: "Histórico de DPS",
      declaredConditions: "Condições Declaradas",
      noConditions: "Nenhuma condição declarada",
      answer: "Resposta:",
      details: "Detalhes:",
      userNotFound: "Usuário não encontrado",
      userNotFoundDesc: "Nenhum resultado para",
      insurancePanel: "Painel Seguradora",
    },
    api: {
      title: "Documentação da API ChainMed",
      subtitle: "API REST para consulta de Declarações Pessoais de Saúde (DPS) registradas na blockchain Sepolia.",
      baseURL: "Base URL",
      authentication: "Autenticação",
      format: "Formato",
      endpoints: "Endpoints",
      authTab: "Autenticação",
      testingTab: "Teste da API",
      examplesTab: "Exemplos",
      queryParams: "Parâmetros de Query",
      headers: "Headers",
      requestExample: "Exemplo de Requisição",
      successResponse: "Resposta de Sucesso (200)",
      errorCodes: "Códigos de Erro",
      getAPIKey: "Obter API Key",
      testKeys: "API Keys de Teste",
      useAPIKey: "Uso da API Key",
      interactiveTest: "Teste Interativo da API",
      testDesc: "Teste a API diretamente nesta página",
      apiResponse: "Resposta da API",
      testAPI: "Testar API",
      testing: "Testando...",
    },
    errors: {
      passwordMismatch: "As senhas não coincidem!",
      acceptTerms: "Você deve aceitar os termos de uso!",
      fillRequired: "Por favor, preencha todos os campos obrigatórios.",
      connectionError: "Erro ao conectar carteira",
      userExists: "Usuário já cadastrado",
      invalidCredentials: "Credenciais inválidas",
      networkError: "Erro de conexão",
      unknownError: "Erro desconhecido",
    },
    dpsForm: {
      title: "Nova Declaração Pessoal de Saúde",
      subtitle: "Preencha o questionário de saúde",
      personalData: "Dados Pessoais",
      responsible: "Responsável",
      additionalParticipants: "Participantes Adicionais",
      addParticipant: "Adicionar Participante",
      removeParticipant: "Remover Participante",
      noParticipants: "Nenhum participante adicionado",
      noParticipantsDesc: "Você pode adicionar familiares para preencher suas DPS junto com a sua",
      familyNote: "Atenção:",
      familyNoteList: [
        "Você responderá o questionário para cada participante",
        "Todos serão cadastrados automaticamente na blockchain",
        "Novos usuários receberão seus hashes por email",
      ],
      progress: "Progresso",
      completed: "concluído",
      dataAndParticipants: "Dados e Participantes",
      selectDPS: "Selecionar DPS para Preencher",
      questionnaire: "Questionário",
      confirmation: "Confirmação",
      participantNumber: "Participante",
      question: "Pergunta",
      of: "de",
      respondingFor: "Respondendo para:",
      participant: "Participante",
      summary: "Resumo da DPS",
      questionnairesCompleted: "Questionários Respondidos",
      questionnairesCompletedDesc: "questionário(s) completo(s) com 20 perguntas cada.",
      finalizeDPS: "Finalizar DPS",
      processing: "Processando...",
      selectDPSToContinue: "Selecione uma DPS para continuar",
      fillQuestionnaire: "Preencher Questionário",
      answered: "Respondido",
      pending: "Pendente",
      important: "Importante:",
      attention: "Atenção:",
      attentionList: [
        "Você responderá o questionário para cada participante",
        "Todos serão cadastrados automaticamente na blockchain",
        "Novos usuários receberão seus hashes por email",
      ],
    },
  },
  en: {
    dps: {
      newStatement: "New Personal Health Statement",
      informYourData: "Enter your data and add participants if necessary",
      selectDpsToFill: "Select DPS to Fill",
      choosePersonToFillDps: "Choose which person you want to fill the DPS for first",
      answerHealthQuestionnaire: "Answer the health questionnaire",
      reviewAllInformation: "Review all information before finalizing",
      responsibleData: "Responsible Data",
      additionalParticipants: "Additional Participants",
      noParticipantsAdded: "No participants added",
      addFamilyMembers: "You can add family members to fill their DPS along with yours",
      youWillAnswer: "You will answer the questionnaire for each participant",
      allWillBeRegistered: "All will be automatically registered on blockchain",
      newUsersWillReceive: "New users will receive their hashes by email",
      selectPersonToFillDpsFirst: "Select which person you want to fill the DPS for first",
      youNeedToAnswer: "You will need to answer the complete questionnaire for each participant",
      answeringFor: "Answering for",
      responsible: "Responsible",
      participant: "Participant",
      question: "Question",
      additionalDetails: "Additional details",
      provideAdditionalDetails: "Provide additional details...",
      dpsSummary: "DPS Summary",
      participants: "Participants",
      questionnairesAnswered: "Answered Questionnaires",
      completeQuestionnaire: "complete questionnaire(s)",
      questionsEach: "questions each",
      finalizeDps: "Finalize DPS",
      selectDpsToContinue: "Select a DPS to continue",
      successMessage: "DPS successfully registered on blockchain!",
      processParticipantsError: "Error processing participants. Continuing without Web3...",
      yourFullName: "Your full name",
    },

    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      continue: "Continue",
      back: "Back",
      next: "Next",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      search: "Search",
      connect: "Connect",
      disconnect: "Disconnect",
      yes: "Yes",
      no: "No",
      notApplicable: "Not applicable",
      progress: "Progress",
      completed: "completed",
      confirmation: "Confirmation",
      attention: "Attention",
      processing: "Processing...",
      previous: "Previous",
      answered: "Answered",
      pending: "Pending",
      with: "with",
      of: "of",
      fullName: "Full Name",
      name: "Name",
      phone: "Phone",
      birthDate: "Birth Date",
      addParticipant: "Add Participant",
    },
    nav: {
      home: "Home",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      newDPS: "New DPS",
      familyDPS: "Family DPS",
      insuranceAccess: "Insurance Access",
      apiDocs: "API Docs",
    },
    homepage: {
      title: "DPS Blockchain Portal",
      subtitle: "ChainMed",
      description:
        "Secure and transparent system for Personal Health Statement, eliminating fraud and centralizing medical information with blockchain technology.",
      fillDPS: "Fill DPS",
      insuranceAccess: "Insurance Access",
      blockchainSecurity: "Blockchain Security",
      blockchainSecurityDesc: "Data protected by SHA-256 hash and blockchain technology",
      blockchainSecurityText:
        "Each DPS is protected by unique hash, ensuring integrity and preventing fraudulent changes.",
      antiFraud: "Anti-Fraud",
      antiFraudDesc: "Centralized system prevents duplicate declarations",
      antiFraudText: "Insurance companies can verify complete DPS history of users, eliminating omissions and fraud.",
      familyManagement: "Family Management",
      familyManagementDesc: "Fill DPS for the whole family in one place",
      familyManagementText: "Family responsible can manage DPS of all members, simplifying the process.",
      footer: "© 2024 ChainMed. All rights reserved. System compliant with ANS.",
    },
    login: {
      title: "Access via Sepolia Blockchain",
      subtitle: "ChainMed",
      userLogin: "User Login",
      insuranceLogin: "Insurance Login",
      connectMetaMask: "Connect MetaMask",
      connecting: "Connecting...",
      accessDashboard: "Access Dashboard",
      requirements: "Access requirements:",
      requirementsList: [
        "MetaMask installed and configured",
        "Wallet connected to Sepolia network",
        "Test ETH for transactions",
        "Previous registration on blockchain",
      ],
      noAccount: "Don't have an account? Register",
      getTestETH: "Get test ETH (Faucet)",
      corporateAccess: "Corporate Access:",
      corporateAccessDesc:
        "Insurance companies must use corporate wallets authorized by ChainMed. Contact support for authorization.",
      registerInsurance: "Register new insurance company",
      walletConnected: "Wallet Connected",
      metamaskInstalled: "Installed",
      metamaskNotInstalled: "Not Installed",
      sepoliaConnected: "Connected",
      sepoliaDisconnected: "Disconnected",
    },
    register: {
      title: "Create new account",
      createAccount: "Create Account",
      userRegister: "User Registration",
      insuranceRegister: "Insurance Registration",
      fullName: "Full Name",
      cpf: "CPF",
      email: "Email",
      phone: "Phone",
      birthDate: "Birth Date",
      password: "Password",
      confirmPassword: "Confirm Password",
      companyName: "Company Name",
      cnpj: "CNPJ",
      technicalResponsible: "Technical Responsible",
      corporateEmail: "Corporate Email",
      acceptTerms: "I accept the",
      termsOfUse: "terms of use",
      privacyPolicy: "privacy policy",
      createAccount: "Create Account",
      registerInsurance: "Register Insurance",
      alreadyHaveAccount: "Already have an account? Login",
      afterRegistration: "After registration you will receive:",
      afterRegistrationList: [
        "Unique API Key for integration",
        "Complete technical documentation",
        "Access to query dashboard",
        "Specialized technical support",
      ],
      creating: "Creating...",
      registering: "Registering...",
    },
    dashboard: {
      title: "My DPS Dashboard",
      subtitle: "Manage your Personal Health Statements registered on Sepolia blockchain",
      newDPS: "New DPS",
      newDPSDesc: "Fill new Personal Health Statement",
      familyDPS: "Family DPS",
      familyDPSDesc: "Fill DPS for family members",
      dpsHistory: "DPS History",
      dpsHistoryDesc: "All your statements registered on blockchain",
      noDPSFound: "No DPS found",
      noDPSFoundDesc: "You have not filled any Personal Health Statement yet.",
      fillFirstDPS: "Fill first DPS",
      participants: "participant(s)",
      conditions: "condition(s)",
      active: "Active",
      inactive: "Inactive",
      records: "records",
      totalDPS: "Registered DPS",
      totalParticipants: "Total Participants",
      activeDPS: "Active DPS",
    },
    dpsQuestions: {
      questions: [
        "Do you have arterial hypertension?",
        "In case of pregnancy, do you have a history of pregnancy-specific hypertensive disease?",
        "Do you have any skin disease (tumors, spots, etc.)?",
        "Do you have any physical disability (e.g.: congenital malformation, genetic syndromes)?",
        "Have you been diagnosed with cancer (malignant neoplasm)?",
        "Have you undergone chemotherapy or radiotherapy?",
        "Do you have morbid obesity?",
        "Do you have any muscular disease (e.g.: myasthenia gravis)?",
        "Have you been diagnosed with any infectious disease (e.g.: Chagas, tuberculosis, meningitis)?",
        "Are you HIV positive (AIDS)?",
        "Do you have any endocrine gland disease (e.g.: thyroid, parathyroid, pituitary, adrenal)?",
        "Do you have any venous disease (e.g.: varicose veins, thrombosis, leg ulcer)?",
        "Do you have any psychiatric disorder or mental illness?",
        "Do you have sequelae from accidents (e.g.: trauma with residual injury)?",
        "Is there medical indication for any type of future surgery?",
        "Have you been hospitalized or operated on before?",
        "Do you use any medication continuously?",
        "Do you have chronic diseases (such as diabetes, asthma, arthritis)?",
        "Have you undergone diagnostic tests (such as tomography, MRI, endoscopy)?",
        "Are you currently pregnant or in the last 12 months? (if applicable to women of childbearing age)",
      ],
      detailsLabel: [
        "Additional details",
        "Additional details",
        "Specify location",
        "Additional details",
        "Inform the year of diagnosis",
        "Provide details",
        "Additional details",
        "Additional details",
        "Describe",
        "Additional details",
        "Specify",
        "Additional details",
        "Additional details",
        "Additional details",
        "Which one?",
        "Inform reasons and dates",
        "List which ones and for what condition",
        "Detail diagnosis",
        "Which ones and when",
        "Additional details",
      ],
    },
    insurance: {
      title: "Insurance Dashboard",
      subtitle: "Anti-Fraud System - Query DPS by Hash or CPF",
      searchDPS: "Query DPS",
      searchDesc: "Search by unique hash or CPF to verify DPS history",
      searchType: "Search Type",
      userHash: "User Hash",
      cpfNumbers: "CPF (numbers only)",
      search: "Search",
      searching: "Searching...",
      examples: "Test examples:",
      clickToFill: "Click to auto-fill",
      fraudAlert: "ANTI-FRAUD ALERT",
      risk: "Risk:",
      clientInfo: "Client Information",
      verified: "Verified",
      name: "Name",
      birthDate: "Birth Date",
      statistics: "Statistics",
      totalDPS: "Total DPS",
      conditions: "Conditions",
      dpsHistory: "DPS History",
      declaredConditions: "Declared Conditions",
      noConditions: "No conditions declared",
      answer: "Answer:",
      details: "Details:",
      userNotFound: "User not found",
      userNotFoundDesc: "No results for",
      insurancePanel: "Insurance Panel",
    },
    api: {
      title: "ChainMed API Documentation",
      subtitle: "REST API for querying Personal Health Statements (DPS) registered on Sepolia blockchain.",
      baseURL: "Base URL",
      authentication: "Authentication",
      format: "Format",
      endpoints: "Endpoints",
      authTab: "Authentication",
      testingTab: "API Testing",
      examplesTab: "Examples",
      queryParams: "Query Parameters",
      headers: "Headers",
      requestExample: "Request Example",
      successResponse: "Success Response (200)",
      errorCodes: "Error Codes",
      getAPIKey: "Get API Key",
      testKeys: "Test API Keys",
      useAPIKey: "API Key Usage",
      interactiveTest: "Interactive API Test",
      testDesc: "Test the API directly on this page",
      apiResponse: "API Response",
      testAPI: "Test API",
      testing: "Testing...",
    },
    errors: {
      passwordMismatch: "Passwords do not match!",
      acceptTerms: "You must accept the terms of use!",
      fillRequired: "Please fill in all required fields.",
      connectionError: "Error connecting wallet",
      userExists: "User already registered",
      invalidCredentials: "Invalid credentials",
      networkError: "Connection error",
      unknownError: "Unknown error",
    },
    dpsForm: {
      title: "New Personal Health Statement",
      subtitle: "Fill out the health questionnaire",
      personalData: "Personal Data",
      responsible: "Responsible",
      additionalParticipants: "Additional Participants",
      addParticipant: "Add Participant",
      removeParticipant: "Remove Participant",
      noParticipants: "No participants added",
      noParticipantsDesc: "You can add family members to fill their DPS along with yours",
      familyNote: "Attention:",
      familyNoteList: [
        "You will answer the questionnaire for each participant",
        "All will be automatically registered on blockchain",
        "New users will receive their hashes by email",
      ],
      progress: "Progress",
      completed: "completed",
      dataAndParticipants: "Data and Participants",
      selectDPS: "Select DPS to Fill",
      questionnaire: "Questionnaire",
      confirmation: "Confirmation",
      participantNumber: "Participant",
      question: "Question",
      of: "of",
      respondingFor: "Answering for:",
      participant: "Participant",
      summary: "DPS Summary",
      questionnairesCompleted: "Completed Questionnaires",
      questionnairesCompletedDesc: "complete questionnaire(s) with 20 questions each.",
      finalizeDPS: "Finalize DPS",
      processing: "Processing...",
      selectDPSToContinue: "Select a DPS to continue",
      fillQuestionnaire: "Fill Questionnaire",
      answered: "Answered",
      pending: "Pending",
      important: "Important:",
      attention: "Attention:",
      attentionList: [
        "You will answer the questionnaire for each participant",
        "All will be automatically registered on blockchain",
        "New users will receive their hashes by email",
      ],
    },
  },
}

export function useTranslation(language: Language = "pt"): Translations {
  return translations[language]
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
