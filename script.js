// const prompt = require("prompt-sync")();

let pacientesCadastrados = [];
let agendamentos = [];

function carregarPacientes() {
  const pacientes = localStorage.getItem("cadastroPaciente");
  if (pacientes) {
    pacientesCadastrados = JSON.parse(pacientes);
  }
}

function salvarPacientes() {
  localStorage.setItem("cadastroPaciente", JSON.stringify(pacientesCadastrados));
}

function cadastrarPaciente() {
  let nomePaciente;
  do {
    nomePaciente = prompt("Digite seu nome: ");
    if (!nomePaciente || nomePaciente.trim() === "") {
      console.log("Nome inválido! Tente novamente.");
    }
  } while (!nomePaciente || nomePaciente.trim() === "");

  let telefonePaciente;
  do {
    telefonePaciente = prompt("Digite seu telefone: ");
    if (!telefonePaciente || telefonePaciente.trim() === "") {
      console.log("Telefone inválido! Tente novamente.");
    }
  } while (!telefonePaciente || telefonePaciente.trim() === "");

  let telefoneExistente = false;
  for (let paciente of pacientesCadastrados) {
    if (paciente.telefone === telefonePaciente) {
      telefoneExistente = true;
      break;
    }
  }

  if (telefoneExistente) {
    console.log("Paciente já cadastrado com este telefone!");
  } else {
    let paciente = {
      nome: nomePaciente,
      telefone: telefonePaciente,
    };
    pacientesCadastrados.push(paciente);
    salvarPacientes();
    console.log("Paciente cadastrado com sucesso!");
  }
  console.log(pacientesCadastrados);
}

function marcarConsulta() {
  
  if (pacientesCadastrados.length === 0) {
    console.log("Nenhum paciente cadastrado.\n");
    return;
  }

  for (let i = 0; i < pacientesCadastrados.length; i++) {    
    console.log(`Paciente ${i + 1} - ${pacientesCadastrados[i].nome}`);
  }

  let pacienteEscolhido;
  do {
    pacienteEscolhido = Number(prompt("Escolha o número do paciente para marcar a consulta: "));
    if (isNaN(pacienteEscolhido) || pacienteEscolhido < 1 || pacienteEscolhido > pacientesCadastrados.length) {
      console.log("Escolha inválida! Tente novamente.");
      pacienteEscolhido = null;
    }
  } while (pacienteEscolhido === null);

  const paciente = pacientesCadastrados[pacienteEscolhido - 1];

  let diaConsulta;
  do {
    diaConsulta = Number(prompt("Digite o dia que deseja marcar a consulta: "));
    const diaAtual = new Date().getDate();
    if (isNaN(diaConsulta) || diaConsulta < diaAtual) {
      console.log("O dia da consulta não pode ser retroativo. Tente novamente.");
    } else {
      break;
    }
  } while (true);

  let horaConsulta;
  do {
    horaConsulta = Number(prompt("Digite a hora que deseja ir a consulta (0-23): "));
    if (isNaN(horaConsulta) || horaConsulta < 0 || horaConsulta > 23) {
      console.log("Hora inválida! Tente novamente.");
    } else {
      break;
    }
  } while (true);

  //Inclui a validação para verificar se existe marcação para a mesma especialdiade no dia e hora agendada, visto que
  // 2 pessoas não podem estar no mesmo médico ao mesmo tempo, porem podem ir em especialidade diferente na mesma hora e dia.

  let especialidadeEscolhida = prompt("Escreva o nome da especialidade médica desejada: ");

  let conflito = false;
  for (let agendamento of agendamentos) {
    if (
      agendamento.dia === diaConsulta &&
      agendamento.hora === horaConsulta &&
      agendamento.especialidade === especialidadeEscolhida
    ) {
      conflito = true;
      break;
    }
  }

  if (conflito) {
    console.log("Já existe um paciente agendado para esse dia e hora na especialidade escolhida.");
    marcarConsulta();
  } else {
    let agendamento = {
      paciente: paciente.nome,
      dia: diaConsulta,
      hora: horaConsulta,
      especialidade: especialidadeEscolhida,
    };
    agendamentos.push(agendamento);
    console.log("Consulta marcada com sucesso!");
    console.log(agendamentos);
  }
}

function cancelarConsulta() {
  
  if (agendamentos.length === 0) {
    console.log("Nenhuma consulta cadastrada.\n");
    return;
  }

  for (let i = 0; i < agendamentos.length; i++) {
    console.log(
      `Agendamento ${i + 1} - Paciente: ${agendamentos[i].paciente}, Dia: ${agendamentos[i].dia}, Hora: ${
        agendamentos[i].hora
      }, Especialidade: ${agendamentos[i].especialidade}`
    );
  }

  let desejaCancelar = Number(prompt("Deseja cancelar uma consulta? 1- Sim ou 2- Não"));
  switch (desejaCancelar) {
    case 1:
      let agendamentoEscolhido;
      do {
        agendamentoEscolhido = Number(prompt("Escolha o número do agendamento para cancelar: "));
        if (isNaN(agendamentoEscolhido) || agendamentoEscolhido < 1 || agendamentoEscolhido > agendamentos.length) {
          console.log("Escolha inválida! Tente novamente.");
          agendamentoEscolhido = null;
        }
      } while (agendamentoEscolhido === null);

      agendamentos.splice(agendamentoEscolhido - 1, 1);
      console.log("Agendamento cancelado com sucesso!\n");
      break;

    case 2:
      console.log("Retornando ao menu");
      break;

    default:
      console.log("Digite uma opção válida");
      break;
  }
}

function menu() {
  carregarPacientes();
  let opcao;
  do {
    opcao = Number(
      prompt(
        "Selecione o número desejado no menu: \n1 - Cadastrar paciente \n2 - Marcar consulta \n3 - Cancelar consulta \n4 - Sair\n"
      )
    );

    switch (opcao) {
      case 1:
        cadastrarPaciente();
        break;
      case 2:
        marcarConsulta();
        break;
      case 3:
        cancelarConsulta();
        break;
      case 4:
        console.log("Até logo!");
        return;
      default:
        console.log("Digite uma opção válida!");
    }
  } while (opcao !== 4);
}

menu();
