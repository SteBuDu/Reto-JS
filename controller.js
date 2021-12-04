$(document).ready(() => {
  var questionNumber = 0;
  var questionBank = new Array();
  var stage0 = "#game0";
  var stage1 = "#game1";
  var stage2 = new Object();
  var answersAside = "#answers";
  var lockQuestion = false;
  var nQuestions;
  var userName;
  var score = 0;
  var modal = "#myModal";
  var randomBank = new Array();
  var answersBank = new Array();

  $.getJSON("questions.json", (data) => {
    for (i = 0; i < data.quizlist.length; i++) {
      questionBank[i] = new Array();
      questionBank[i][0] = data.quizlist[i].question;
      questionBank[i][1] = data.quizlist[i].option1;
      questionBank[i][2] = data.quizlist[i].option2;
      questionBank[i][3] = data.quizlist[i].option3;
    }

    nQuestions = questionBank.length;
    displayStart();
  });

  function displayStart() {
    $(stage0).append(
      '<img class="userImg" src="img/user-circle-solid.svg" alt="User img"><p>Cual es tu nombre?</p><input type="text" name="textUser" id="textUser"><img class="startQuiz" src="img/angle-double-right-solid.svg" alt=""></img>'
    );

    $(".startQuiz").click(() => {
      userName = $("#textUser").val().trim();
      if (userName != "") {
        $(stage0).animate({ opacity: "0" }, "slow", () => {
          $(stage0).remove();
          displayQuestion(true);
        });
      } else {
        alert("Debes escribir un nombre");
      }
    });
  }

  function displayQuestion(first = false) {
    var q1, q2, q3;
    var rnd = Math.random() * 3;
    rnd = Math.ceil(rnd);
    randomBank.push(rnd);
    ({ q1, q2, q3 } = shuffle(rnd, q1, q2, q3, questionNumber));

    if (first) {
      $(stage1).animate({ right: "0", opacity: "1" }, "slow");
    }

    $(stage1).append(
      `<div  class="questionText"> 
          ${questionBank[questionNumber][0]}
      </div>
      <div id="1" class="pix">
          <img src="img/${q1}">
      </div>
      <div id="2" class="pix">
          <img src="img/${q2} ">
      </div>
      <div id="3" class="pix">
          <img src="img/${q3} ">
      </div>`
    );

    $(".pix").click(function () {
      if (lockQuestion == false) {
        lockQuestion = true;
        answersBank.push(this.id);

        if (this.id == rnd) {
          $(stage1).append('<div class="feedback1">CORRECTO</div>');
          score++;
          $(answersAside).append(
            `<p data-questionNumber="${
              questionNumber + 1
            }" class="rightAnswer">${
              questionNumber + 1
            }<i class="fas fa-check"></i></p>`
          );
        }

        if (this.id != rnd) {
          $(stage1).append('<div class="feedback2">INCORRECTO</div>');
          $(answersAside).append(
            `<p data-questionNumber="${
              questionNumber + 1
            }"class="wrongAnswer answerQuestion">${
              questionNumber + 1
            }<i class="fas fa-check"></i></p>`
          );
        }

        setTimeout(() => changeQuestion(), 1000);
      }
    });
  }

  function shuffle(rnd, q1, q2, q3, questionNumber) {
    if (rnd == 1) {
      q1 = questionBank[questionNumber][1];
      q2 = questionBank[questionNumber][2];
      q3 = questionBank[questionNumber][3];
    } else if (rnd == 2) {
      q2 = questionBank[questionNumber][1];
      q3 = questionBank[questionNumber][2];
      q1 = questionBank[questionNumber][3];
    } else {
      q3 = questionBank[questionNumber][1];
      q1 = questionBank[questionNumber][2];
      q2 = questionBank[questionNumber][3];
    }
    return { q1, q2, q3 };
  }

  function changeQuestion() {
    questionNumber++;
    if (stage1 == "#game1") {
      stage2 = "#game1";
      stage1 = "#game2";
    } else {
      stage2 = "#game2";
      stage1 = "#game1";
    }

    if (questionNumber < nQuestions) {
      displayQuestion();
    } else {
      displayEnd();
    }

    $(stage2).animate({ right: "+=600px", opacity: "-=1" }, "slow", () => {
      $(stage2).css("right", "-600px");
      $(stage2).empty();
    });

    $(stage1).animate({ right: "+=600px", opacity: "1" }, "slow", () => {
      lockQuestion = false;
    });
  }

  function displayEnd() {
    $(stage1).append(
      `<div class="questionText">Felicidades <em>${userName} </em>
          <br>Preguntas Totales: ${nQuestions} 
          <br>Preguntas Correctas: ${score} 
      </div>`
    );

    $(".answerQuestion").css("cursor", "pointer");

    $(".answerQuestion").click(function () {
      $(modal).empty();
      let q1, q2, q3;
      ({ q1, q2, q3 } = shuffle(
        randomBank[this.dataset.questionnumber - 1],
        q1,
        q2,
        q3,
        this.dataset.questionnumber - 1
      ));

      $(modal).append(`<div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Respuesta Pregunta N° ${
                          this.dataset.questionnumber
                        }</h4>
                    </div>
                    <div class="modal-body">
                        <p>${
                          questionBank[this.dataset.questionnumber - 1][0]
                        }</p>
                        <img data-answer="1" class="answerModal" src="img/${q1}" alt="">
                        <img data-answer="2" class="answerModal" src="img/${q2}" alt="">
                        <img data-answer="3" class="answerModal" src="img/${q3}" alt="">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>`);

      let aux = $(".answerModal");

      for (let i = 0; i < aux.length; i++) {
        if (
          aux[i].dataset.answer == randomBank[this.dataset.questionnumber - 1]
        ) {
          aux[i].classList.add("rightAnswerModal");
        } else if (
          aux[i].dataset.answer == answersBank[this.dataset.questionnumber - 1]
        ) {
          aux[i].classList.add("wrongAnswerModal");
        }
      }
      $(modal).modal("show");
    });
  }
});
