const questions = [
  { q:"Heart function?", o:["Pump blood","Digest","Think"], a:0 },
  { q:"America discovered?", o:["Columbus","Newton","Tesla"], a:0 },
  { q:"Normal temp?", o:["37°C","40°C","35°C"], a:0 },
  { q:"WW2 ended?", o:["1945","1939","1918"], a:0 },
  { q:"Blood carries?", o:["Oxygen","Water","Fat"], a:0 },
  { q:"Kidney job?", o:["Filter","Pump","Store"], a:0 },
  { q:"Pyramids?", o:["Egypt","India","China"], a:0 },
  { q:"Bones?", o:["206","300","150"], a:0 },
  { q:"Rome capital?", o:["Rome","Paris","Berlin"], a:0 },
  { q:"Brain does?", o:["Control body","Pump","Filter"], a:0 }
];

let current = 0;
let score = 0;
let answered = Array(questions.length).fill(false);
let userAnswers = Array(questions.length).fill(null);

const qList = document.getElementById("qList");

questions.forEach((_,i)=>{
  const div = document.createElement("div");
  div.className = "q-item";
  div.innerText = "Q" + (i+1);
  div.onclick = () => {
    current = i;
    loadQuestion();
  };
  qList.appendChild(div);
});

function loadQuestion(){

  document.getElementById("question").innerText = questions[current].q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  questions[current].o.forEach((opt,i)=>{
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;

    if(userAnswers[current] !== null){
      if(i === questions[current].a) div.classList.add("correct");
      if(i === userAnswers[current] && i !== questions[current].a) div.classList.add("wrong");
    }

    div.onclick = () => {
      if(answered[current]) return;

      answered[current] = true;
      userAnswers[current] = i;

      if(i === questions[current].a){
        score++;
      }

      updateProgress();
      updateSidebar();
      loadQuestion();
    };

    optionsDiv.appendChild(div);
  });

  updateActive();
}

function nextQuestion(){
  if(current < questions.length - 1){
    current++;
    loadQuestion();
  } else {
    endQuiz();
  }
}

function prevQuestion(){
  if(current > 0){
    current--;
    loadQuestion();
  }
}

function showAnswer(){
  if(answered[current]) return;

  answered[current] = true;
  userAnswers[current] = questions[current].a;

  updateProgress();
  updateSidebar();
  loadQuestion();
}

function updateActive(){
  [...qList.children].forEach(el => el.classList.remove("active"));
  qList.children[current].classList.add("active");
}

function updateSidebar(){
  [...qList.children].forEach((el,i)=>{
    if(answered[i]) el.classList.add("done");
  });
}

function updateProgress(){
  let done = answered.filter(x => x).length;
  let percent = Math.round((done / questions.length) * 100);
  document.getElementById("progress").style.width = percent + "%";
}

function endQuiz(){
  document.getElementById("quizCard").style.display = "none";
  document.getElementById("resultCard").style.display = "block";

  let percent = Math.round((score / questions.length) * 100);

  document.getElementById("scoreText").innerText =
    score + "/" + questions.length + " (" + percent + "%)";

  drawChart(percent);
}

function drawChart(percent){
  const c = document.getElementById("chart");
  const ctx = c.getContext("2d");

  let val = 0;

  function anim(){
    ctx.clearRect(0,0,200,200);

    ctx.beginPath();
    ctx.arc(100,100,80,0,2*Math.PI);
    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(100,100,80,-Math.PI/2,(val/100)*2*Math.PI - Math.PI/2);
    ctx.strokeStyle = "#cfc7ff";
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.font = "20px Poppins";
    ctx.fillText(val + "%", 75, 105);

    if(val < percent){
      val++;
      requestAnimationFrame(anim);
    }
  }

  anim();
}

function restart(){
  current = 0;
  score = 0;
  answered.fill(false);
  userAnswers.fill(null);

  document.getElementById("quizCard").style.display = "block";
  document.getElementById("resultCard").style.display = "none";

  document.getElementById("progress").style.width = "0%";

  loadQuestion();
}

loadQuestion();