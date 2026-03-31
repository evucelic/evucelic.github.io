document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-time').textContent = new Date().toString().split(' GMT')[0];

  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('terminal-output');
  const logContent = document.getElementById('log-content');

  let history = [];
  let historyIndex = -1;
  let isTrainRunning = false;

  const fileContents = {
    'education.md': `
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2025 —<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Master's in Data Science @ FER</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Currently diving deeper into machine learning, advanced data systems, and quantitative analytics as part of my Masters.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2022 —<br>2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Bachelor's in Computing @ FER</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">This is where I built my foundation in software engineering, algorithms, and applied mathematics.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2018 —<br>2022</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">V. Gimnazija, Zagreb</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">High school diploma focused on natural sciences and mathematics, which naturally pushed me toward a technical career path.</p>
        </div>
      </div>
    `,
    'experience.md': `
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Nov 2025 —<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Vicuna — ML & Full Stack Intern</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">I'm currently building real-time systems to process cryptocurrency data and turn it into trading strategies. Besides the data stuff, I develop both frontend and backend architecture (for both in-house strategies, and clients) to monitor and interact with trading strategies.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Feb 2025 —<br>Nov 2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Ericsson Nikola Tesla — Software Developer</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">My first break into the development space. Spent almost a year here as a Python backend developer. I worked on a global network traffic and data protection product, and spent a lot of time writing FastAPI and Django code to integrate new modules into their (quite mature) production codebase.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2024</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Academies: TIS GRUPA & Interkapital</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Did a couple of academies in 2024 to break into development work and check out other areas. In the summer at TIS, I focused on Java/Spring server-side development, finishing with a backend hackathon project. Earlier in the spring at Interkapital, I wanted to see what other fields could be interesting to me as a computer science student. Apart from the basic economy stuff, I liked using Bloomberg Terminals, building DCF valuations, and analyzing financial data for investment opportunities.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Late 2023</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">KOREQT — Data Processing Assistant</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">My first real job. I was hired to manually prepare Excel data for a CMS database. I got tired of the manual labor pretty fast, so in my free time I wrote Python scripts using Pandas, BeautifulSoup, and openpyxl to automate most of my daily tasks.</p>
        </div>
      </div>
    `,
    'volunteering.md': `
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2023 —<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">KSET - Member and Head of Disco Section</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">I am currently running the Disco section at this student club. I organize DJ events, handle the administration stuff, and mentor new members who want to learn.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2023 —<br>2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Financial Club & Job Fair</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">At the Financial Club, I led the virtual portfolio optimization using modern portfolio theory, tracking performance and generating reports. Around the same time, I worked as an Account Manager for FER's Job Fair, handling communication with tech companies to get them onboarded for the event.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Summer<br>2019</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Croatian Academic Sport Union</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Back in high school, I spent a summer volunteering at international student beach volleyball and martial arts competitions. Good times and a great way to meet people.</p>
        </div>
      </div>
    `,
    'skills.json': `
      <div class="mono text-sm text-zinc-800 leading-relaxed">
        <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
          <div class="text-xs text-zinc-500">LANGUAGES</div>
          <div>Python (main), Java, R, C/C++</div>
        </div>
        <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
          <div class="text-xs text-zinc-500">FRAMEWORKS</div>
          <div>FastAPI, Django, Spring Boot, PyTorch, Pandas, NumPy, Scikit-learn, NextJS</div>
        </div>
        <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
          <div class="text-xs text-zinc-500">TOOLS_&_DB</div>
          <div>Git, Linux CLI, Docker, PostgreSQL, Postman, Wireshark</div>
        </div>
      </div>
    `,
    'projects.md': `
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2025 —<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            Diplomski Projekt
            <a href="https://github.com/evucelic/Diplomski-Projekt" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">My Master's project. I'm building a deep learning model that combines VAEs and hidden Markov models to generate synthetic financial data that actually behaves like the real thing - useful for stress testing.</p>
          <div class="mono text-xs text-zinc-400 mt-2">PyTorch · HMM · VAE · Jupyter</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            HMM Market Regime Estimation
            <a href="https://github.com/evucelic/HMM-Market-Regime-Estimation" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">My Bachelor's thesis. Used hidden Markov models to estimate market regimes (bull, bear, sideways) from financial time series. The goal was to see if regime-aware strategies outperform naive ones.</p>
          <div class="mono text-xs text-zinc-400 mt-2">Python · HMM · Jupyter · Time Series</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2025</div>
        <div>
            <h3 class="font-medium text-zinc-900 mb-1">
            FaksFit
            <a href="https://github.com/evucelic/FaksFit" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
            </h3>
            <p class="text-sm text-zinc-600 leading-relaxed">A team project from my Software Engineering course at FER. FaksFit is a full-stack web app that makes it easier for students to manage their PE (physical education) course requirements - booking slots, tracking points, and seeing what's left to pass. I handled the backend, database design, and deployment.</p>
            <div class="mono text-xs text-zinc-400 mt-2">Spring Boot · React · Java · PostgreSQL · Docker · Render</div>
        </div>
        </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            Early Predictors for Student Success
            <a href="https://github.com/evucelic/Early-Predictors-For-Success" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">A replication and reinterpretation of an academic paper on predicting student success from behavioural and demographic indicators. Rebuilt the methodology, tested different models, and compared results against the original findings.</p>
          <div class="mono text-xs text-zinc-400 mt-2">Python · Scikit-learn · Jupyter · ML</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2024 —<br>2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            EQ Performance Backtesting
            <a href="https://github.com/evucelic/EQ-Performance-Backtesting" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Backtested an equilibrium model from modern portfolio theory (the Black-Litterman approach) on historical US stock data.</p>
          <div class="mono text-xs text-zinc-400 mt-2">Python · Pandas · NumPy · Jupyter</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2024</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            Music & Mental Health Analysis
            <a href="https://github.com/evucelic/Music-Mental-Health-Analysis" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">A statistical analysis in R exploring whether music preferences correlate with mental health outcomes. Done as a university project - more exploratory than conclusive, but a good exercise in statistical modelling and data visualisation in R.</p>
          <div class="mono text-xs text-zinc-400 mt-2">R · Statistics · Data Visualisation</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2023 —<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            Advent of Code
            <a href="https://github.com/evucelic/AOC25" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ 2025</a>
            <a href="https://github.com/evucelic/AOC24" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ 2024</a>
            <a href="https://github.com/evucelic/AOC23" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ 2023</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Three years of Advent of Code solutions in Python. Fun with friends!</p>
          <div class="mono text-xs text-zinc-400 mt-2">Python · Algorithms</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4">
        <a href="https://github.com/evucelic" target="_blank" rel="noopener noreferrer" class="mono text-xs text-zinc-400 hover:text-zinc-700 transition-colors border-b border-zinc-300 hover:border-zinc-700">↗ view all repos on github.com/evucelic</a>
      </div>
    `
  };

  const allFiles = Object.keys(fileContents);
  const allCommands = ['help', 'ls', 'cat', 'clear', 'whoami', 'sl'];

  function printTerm(text, styleClass = 'text-zinc-300') {
    const line = document.createElement('div');
    line.className = styleClass;
    line.innerHTML = text;
    termOutput.appendChild(line);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function runTrain() {
    if (isTrainRunning) return;
    isTrainRunning = true;
    termInput.disabled = true;

    const wheels = [
      "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n |/-=|___|=    ||    ||    ||    |_____/~\\___/        \n  \\_/      \\_O=====O=====O=====O/      \\_/            ",
      "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n |/-=|___|=    ||    ||    ||    |_____/~\\___/        \n  \\_/      \\_O=====O=====O=====O/      \\_/            ",
      "__/ =| o |=-~\\ \\ /~\\ \\ /~\\ \\ /~\\ \\____Y___________|__|\n |/-=|___|=   | |   | |   | |   | |____/~\\___/        \n  \\_/      \\_O=====O=====O=====O/      \\_/            ",
      "__/ =| o |=-~\\ \\ /~\\ \\ /~\\ \\ /~\\ \\____Y___________|__|\n |/-=|___|=   | |   | |   | |   | |____/~\\___/        \n  \\_/      \\_O=====O=====O=====O/      \\_/            ",
      "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n |/-=|___|=   ||    ||    ||    | |____/~\\___/        \n  \\_/      \\__O=====O=====O=====O/     \\_/            ",
      "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n |/-=|___|=   ||    ||    ||    | |____/~\\___/        \n  \\_/      \\__O=====O=====O=====O/     \\_/            "
    ];

    const body = "      ====        ________                ___________ \n  _D _|  |_______/        \\__I_I_____===__|_________| \n   |(_)---  |   H\\________/ |   |        =|___ ___|   \n   /     |  |   H  |  |     |   |         ||_| |_||   \n  |      |  |   H  |__--------------------| [___] |   \n  | ________|___H__/__|_____/[][]~\\_______|       |   \n  |/ |   |-----------I_____I [][] []  D   |=======|___\n";

    const smoke = [
      "                 (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O",
      "            (@@@) (@@@@) (@@)  (@@)  (@)    ( )    O     @     O     @      O",
      "       (@@@)  (@@@@) (@@@@) (@@)  (@@)  (@)    ( )    O     @     O     @      O",
      "  (@@@@) (@@@@)  (@@@@) (@@)  (@@)  (@)    ( )    O     @     O     @      O",
      " (@@@@) (@@@@)  (@@@@) (@@)  (@@)  (@)    ( )    O     @     O     @      O",
      "(@@@@) (@@@@)  (@@@@) (@@)  (@@)  (@)    ( )    O     @     O     @      O"
    ];

    const trainContainer = document.createElement('div');
    trainContainer.className = 'text-zinc-500 text-[10px] md:text-xs font-bold mono whitespace-pre overflow-hidden my-4';
    trainContainer.style.position = 'relative';
    trainContainer.style.height = '140px';
    trainContainer.style.width = '100%';
    termOutput.appendChild(trainContainer);
    termOutput.scrollTop = termOutput.scrollHeight;

    const trainElem = document.createElement('div');
    trainElem.style.position = 'absolute';
    trainElem.style.right = '-800px'; 
    trainElem.style.lineHeight = '1.1';
    trainContainer.appendChild(trainElem);

    let pos = -800;
    let frame = 0;
    
    const interval = setInterval(() => {
      pos += 15; 
      trainElem.style.right = pos + 'px';
      
      const s = smoke[frame % 6];
      const w = wheels[frame % 6];
      trainElem.textContent = s + "\n" + body + w;
      
      frame++;
      
      termOutput.scrollTop = termOutput.scrollHeight;

      if (pos > termOutput.clientWidth + 200) {
        clearInterval(interval);
        trainContainer.remove();
        isTrainRunning = false;
        termInput.disabled = false;
        termInput.focus();
      }
    }, 45);
  }

  termInput.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const parts = termInput.value.split(' ');
      const last = parts[parts.length - 1];
      if (parts.length === 1) {
        const match = allCommands.find(c => c.startsWith(last));
        if (match) termInput.value = match;
      } else {
        const match = allFiles.find(f => f.startsWith(last));
        if (match) { parts[parts.length - 1] = match; termInput.value = parts.join(' '); }
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        termInput.value = history[history.length - 1 - historyIndex];
      }
      return;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        termInput.value = history[history.length - 1 - historyIndex];
      } else {
        historyIndex = -1;
        termInput.value = '';
      }
      return;
    }

    if (e.key === 'Enter') {
      if (isTrainRunning) return;

      const rawCmd = termInput.value.trim();
      const args = rawCmd.split(' ').filter(Boolean);

      const promptLine = document.createElement('div');
      promptLine.innerHTML = `<span class="text-emerald-500">eugen@portfolio</span><span class="text-zinc-500">:~</span>$ ${rawCmd}`;
      termOutput.appendChild(promptLine);

      if (rawCmd) {
        history.push(rawCmd);
        historyIndex = -1;
      }

      termInput.value = '';

      if (args.length === 0) {
        termOutput.scrollTop = termOutput.scrollHeight;
        return;
      }

      const cmd = args[0].toLowerCase();

      switch (cmd) {
        case 'help':
          printTerm('Available commands:');
          printTerm('&nbsp;&nbsp;<span class="text-blue-400">ls</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;List available files');
          printTerm('&nbsp;&nbsp;<span class="text-blue-400">cat</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Display file content (e.g., cat experience.md)');
          printTerm('&nbsp;&nbsp;<span class="text-blue-400">clear</span>&nbsp;&nbsp;&nbsp;&nbsp;Clear terminal window');
          printTerm('&nbsp;&nbsp;<span class="text-blue-400">whoami</span>&nbsp;&nbsp;&nbsp;Print user information');
          printTerm('&nbsp;&nbsp;<span class="text-blue-400">sl</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Steam locomotive');
          break;

        case 'ls':
          printTerm('<span class="text-blue-400 mr-4">education.md</span><span class="text-blue-400 mr-4">experience.md</span><span class="text-blue-400 mr-4">volunteering.md</span><span class="text-blue-400 mr-4">projects.md</span><span class="text-emerald-400">skills.json</span>');
          break;

        case 'cat':
          if (args.length < 2) {
            printTerm('cat: missing operand. Try: cat experience.md', 'text-red-400');
          } else {
            const file = args[1];
            if (fileContents[file]) {
              printTerm(`Reading ${file}... Check the output`, 'text-zinc-500 italic');
              logContent.innerHTML = fileContents[file];
              logContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              printTerm(`cat: ${file}: No such file or directory`, 'text-red-400');
            }
          }
          break;

        case 'whoami':
          printTerm('eugen_vucelic - Data Science Grad Student @ FER, ML/Full Stack Intern @ Vicuna');
          break;

        case 'sl':
          runTrain();
          break;

        case 'clear':
          termOutput.innerHTML = '';
          break;

        default:
          printTerm(`bash: ${cmd}: command not found`, 'text-red-400');
      }

      termOutput.scrollTop = termOutput.scrollHeight;
    }
  });
});