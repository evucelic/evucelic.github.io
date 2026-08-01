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
        <div class="mono text-xs text-zinc-500">2025 -<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Master's in Data Science @ FER</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Currently focusing on machine learning, statistical modelling, and work with financial time series.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2022 -<br>2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Bachelor's in Computing @ FER</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Built a foundation in software engineering, algorithms, probability, statistics, and applied machine learning.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2018 -<br>2022</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">V. Gimnazija, Zagreb</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Math and science focused high school.</p>
        </div>
      </div>
    `,
    'experience.md': `
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Jul 2026 -<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Infobip - AI Research Intern</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Working on applied AI research, exploring and prototyping approaches around agents and agentic systems</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Nov 2025 -<br>Jun 2026</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Vicuna - ML & Full Stack Developer</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Worked on real-time crypto data systems, internal dashboards, and ML experiments around trading signals. Most of the work sat somewhere between data engineering, backend development, and applied machine learning.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Feb 2025 -<br>Nov 2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Ericsson Nikola Tesla - Software Developer</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Worked as a Python backend developer on internal tools and a global product in the network security, privacy, and compliance space. Mostly FastAPI work, production features, tests, bug fixes, and a lot of learning inside a large existing codebase.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2024</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Academies: TIS GRUPA & Interkapital</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Spent part of 2024 exploring both backend development and finance. At TIS I worked with Java and Spring, while at Interkapital I got hands-on exposure to valuation, Bloomberg terminals, and financial analysis.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">Late 2023</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">KOREQT - Data Processing Assistant</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Started with repetitive Excel and CMS work, then automated a good part of it with Python scripts using pandas, BeautifulSoup, and openpyxl.</p>
        </div>
      </div>
    `,
    'volunteering.md': `
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2023 -<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">KSET - Head of Disco Section</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">I run the Disco section, help organise events, and coordinate the people and logistics around it.</p>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2023 -<br>2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">Financial Club</h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Tracked portfolio performance, built reports and visuals in Excel and Power BI, and worked on portfolio optimisation problems.</p>
        </div>
      </div>
    `,
    'skills.json': `
      <div class="mono text-sm text-zinc-800 leading-relaxed">
        <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
          <div class="text-xs text-zinc-500">LANGUAGES</div>
          <div>Python (main), SQL, R, Java, C/C++</div>
        </div>
        <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
          <div class="text-xs text-zinc-500">FRAMEWORKS</div>
          <div>FastAPI, Django, PyTorch, Pandas, NumPy, Scikit-learn, NextJS, Spring Boot</div>
        </div>
        <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-4">
          <div class="text-xs text-zinc-500">TOOLS_&_DB</div>
          <div>PostgreSQL, Docker, Git, Linux CLI, pytest, Postman, Wireshark, AWS EC2</div>
        </div>
      </div>
    `,
    'projects.md': `
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2026</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            ankiautomate
            <a href="https://github.com/evucelic/ankiautomate" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Working on making a small UI app to speed up creating Japanese vocabulary Anki cards with a lot of fields, I got really tired of entering all of my fields manually...</p>
          <div class="mono text-xs text-zinc-400 mt-2">Python · UI Tooling</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2026</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            Buy Signal
            <a href="https://github.com/evucelic/buy-signal" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">A Telegram bot that tracks a buy signal for the US market by watching VIX, Fed rate outlook, FINRA margin debt trend, leading sectors, and broader market moves. Rule based system, informative only.</p>
          <div class="mono text-xs text-zinc-400 mt-2">Python · Telegram Bot · Web Scraping</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2025 -<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            Diplomski Projekt
            <a href="https://github.com/evucelic/Diplomski-Projekt" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">My master's project. I'm working on deep generative models for synthetic financial data, with the goal of generating data that is useful enough for analysis and stress testing, not just visually similar.</p>
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
          <p class="text-sm text-zinc-600 leading-relaxed">My bachelor's thesis. I used hidden Markov models to estimate market regimes and test whether regime-aware portfolio decisions can hold up better than simpler baselines.</p>
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
            <p class="text-sm text-zinc-600 leading-relaxed">A software engineering team project built to make PE course administration easier for students. I worked on the backend, database design, and deployment.</p>
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
          <p class="text-sm text-zinc-600 leading-relaxed">A university ML project based on replicating and reinterpreting an academic paper on student success prediction.</p>
          <div class="mono text-xs text-zinc-400 mt-2">Python · Scikit-learn · Jupyter · ML</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2024 -<br>2025</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            EQ Performance Backtesting
            <a href="https://github.com/evucelic/EQ-Performance-Backtesting" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ github</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Backtested a Black-Litterman style portfolio model on historical US stock data.</p>
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
          <p class="text-sm text-zinc-600 leading-relaxed">An R-based statistics project exploring the relationship between music preferences and mental health indicators.</p>
          <div class="mono text-xs text-zinc-400 mt-2">R · Statistics · Data Visualisation</div>
        </div>
      </div>
      <div class="border-t border-zinc-200 py-4 grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-4">
        <div class="mono text-xs text-zinc-500">2023 -<br>present</div>
        <div>
          <h3 class="font-medium text-zinc-900 mb-1">
            Advent of Code
            <a href="https://github.com/evucelic/AOC25" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ 2025</a>
            <a href="https://github.com/evucelic/AOC24" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ 2024</a>
            <a href="https://github.com/evucelic/AOC23" target="_blank" rel="noopener noreferrer" class="ml-2 mono text-xs font-normal text-zinc-400 border-b border-zinc-300 hover:text-zinc-700 hover:border-zinc-700 transition-colors">↗ 2023</a>
          </h3>
          <p class="text-sm text-zinc-600 leading-relaxed">Three years of Advent of Code solutions in Python.</p>
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
      "__/ =| o |=-~\\ \\ /~\\ \\ /~\\ \\ /~\\ \\____Y___________|__|\n |/-=|___|=    | |   | |   | |   | |____/~\\___/        \n  \\_/      \\_O=====O=====O=====O/      \\_/            ",
      "__/ =| o |=-~\\ \\ /~\\ \\ /~\\ \\ /~\\ \\____Y___________|__|\n |/-=|___|=    | |   | |   | |   | |____/~\\___/        \n  \\_/      \\_O=====O=====O=====O/      \\_/            ",
      "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n |/-=|___|=    ||    ||    ||    | |____/~\\___/        \n  \\_/      \\__O=====O=====O=====O/     \\_/            ",
      "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n |/-=|___|=    ||    ||    ||    | |____/~\\___/        \n  \\_/      \\__O=====O=====O=====O/     \\_/            "
    ];

    const body = "      ====        ________                ___________ \n  _D _|  |_______/        \\__I_I_____===__|_________| \n   |(_)---  |   H\\________/ |   |        =|___ ___|   \n   /     |  |   H  |  |     |   |         ||_| |_||   \n  |      |  |   H  |__--------------------| [___] |   \n  | ________|___H__/__|_____/[][]~\\_______|       |   \n  |/ |   |-----------I_____I [][] []  D   |=======|___\n";

    const smoke = [
      "                (  ) (@@) ( )  (@)  ()    @@    O     @     O     @      O",
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
          printTerm('eugen_vucelic - AI Research Intern @ Infobip | Data Science Student @ FER');
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