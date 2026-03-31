document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-time').textContent = new Date().toString().split(' GMT')[0];

  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('terminal-output');
  const logContent = document.getElementById('log-content');

  let history = [];
  let historyIndex = -1;

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
          <p class="text-sm text-zinc-600 leading-relaxed">Did a couple of academies in 2024 to break into development work and check out other areas. In the summer at TIS, I focused on Java/Spring server-side development, finishing with a backend hackathon project. Earlier in the spring at Interkapital, I wanted to see what other fields could be interesting to me as a computer science student.  Apart from the basic economy stuff, I liked using Bloomberg Terminals, building DCF valuations, and analyzing financial data for investment opportunities.</p>
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
      <div class="border-t border-zinc-200 py-4 text-sm text-zinc-500 italic">
        // Projects parsing from GitHub... Please check back later or visit
        <a href="https://github.com/evucelic" target="_blank" rel="noopener noreferrer" class="text-zinc-800 border-b border-zinc-400 hover:text-blue-600 hover:border-blue-600 transition-colors">github.com/evucelic</a>
      </div>
    `
  };

  function printTerm(text, styleClass = 'text-zinc-300') {
    const line = document.createElement('div');
    line.className = styleClass;
    line.innerHTML = text;
    termOutput.appendChild(line);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  termInput.addEventListener('keydown', function(e) {
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
          printTerm('eugen_vucelic — Data Science Grad Student @ FER, ML/Full Stack Intern @ Vicuna');
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