/* MBAI LAB — 前端逻辑
 * 启动时尝试从后端拉取题目/文案（/api/questions），失败则使用下方内置数据。 */
const LOCAL = {
  questions: [
    [0, '明天要交一份陌生主题的报告，你最想让 AI 给你什么？', ['一份能改的初稿，先把空白页消灭。', '一张思路图和几个关键概念，我想弄懂再写。']],
    [1, '你要和 AI 一起准备一场分享，第一条消息会怎么发？', ['“主题在这儿，你帮我想想怎么讲。”', '“我想讲三个部分，先一起把第二部分理顺。”']],
    [2, 'AI 给出一条特别适合放进汇报的数据。你会？', ['如果和我对这个话题的印象差不多，就先放进去。', '找到原始出处，看统计口径和时间对不对。']],
    [0, '代码报错了，AI 能直接给你修好。你更想收到？', ['一段替换后就能跑的代码。', '对报错原因的解释，最好再给我一个提示。']],
    [1, 'AI 给你排了一份七天学习计划，你会怎么开始？', ['照它给的顺序先学一天，看看节奏。', '先按自己的时间和薄弱项重排，再开始。']],
    [2, 'AI 推荐的参考文献，标题简直像为你量身定做。你会？', ['先记进参考书单，看起来确实对题。', '搜一下它是否存在，再确认原文是不是这么说。']],
    [0, 'AI 帮你改完一封难写的邮件，你下一步更可能是？', ['通读一遍，合适就发。', '问问它为什么这么改，下次我也能用。']],
    [1, '头脑风暴卡住了，你打算把哪部分交给 AI？', ['让它自己挑角度，先给我几个方案。', '我先定目标和限制，请它沿着我指定的方向想。']],
    [2, 'AI 的解释读起来很顺，还给了一个例子。你怎么判断它说得对？', ['例子讲得通，我就先按这个理解。', '换个例子试一下，看看这个说法还成立吗？']]
  ],
  profiles: {
   '000':['赛博甩手掌柜','你看着办，做好发我。','你的输入是需求，理想输出是可直接交付的文件。你擅长省下重复劳动，但一句「差不多」也可能把错误放进成品。','交付前自己挑一个最重要的细节，查一遍。'],
   '001':['成品验收官','过程我不管，引用我会查。','你让 AI 自由发挥，自己守住最后一道关。看到漂亮的图表，你的第一反应是问原始数据在哪。','除了验最终答案，也问一句：这个结果是怎么得出来的？'],
   '010':['提示词霸总','严格按我的十八条要求写。','标题、字数、语气，全在你的掌控之中。只是你可能改了七轮开头，还没点开正文里那篇看起来很权威的文献。','少加一句「写得更高级」，多查一个关键事实。'],
   '011':['人机项目经理','你按步骤做，这三处我来确认。','你定标准、分任务、做验收。AI 一次给出十个方向时，你已经在给它们排优先级了。','把最有意思的一步留给自己，再和 AI 的做法比一比。'],
   '100':['赛博拜师人','老师我懂了……你再讲一遍。','你喜欢有人带着学，遇到难点就请 AI 换个比喻。听得顺的时候，容易把「看懂了」误当成「会做了」。','关掉对话，用自己的话讲一遍，再试做一道新题。'],
   '101':['师门质检员','老师，这里怎么和教材不一样？','你愿意跟着 AI 学，但不签空白支票。例子讲得再动听，碰到说不通的地方，你照样会暂停查资料。','查到矛盾后，写下你最终采信谁、为什么。'],
   '110':['学习流程收藏家','先定目标，再搭框架，最后生成复盘。','你擅长把学习安排得井井有条。计划表已经排到下个月，实际做过的第一道题有时还在等待开张。','今天少生成一份计划，多做一道题，用结果调整明天的计划。'],
   '111':['脑力陪练员','先别给答案，指出我的推理漏洞。','你把 AI 约来当陪练：先出招，再让它反驳。你会挑着采纳反馈，也乐于自己试出答案。','给追问设个上限，留出时间独立完成下一题。']
  },
  labels: [['交差','取经'],['放养','控场'],['随缘','验货']],
  letters: [['D','L'],['F','S'],['T','V']],
  guide: [
    { title:'目的', question:'打开 AI，你想带走成品，还是学会方法？', sides:[
      ['先拿到能用的结果，把时间留给别的事。','整理会议纪要、把通知改成表格时，可以放心追求效率。','如果任务本来就是练能力，交付前问自己：下次我能独立做哪一步？'],
      ['把 AI 当老师或陪练，想知道答案背后的做法。','学新概念、练写作或学编程时，试着先要提示，再自己动手。','看懂解释很容易产生「我会了」的感觉。关掉对话，换一道题试试。']]},
    { title:'掌舵', question:'这一轮，谁来决定任务怎么做？', sides:[
      ['先给 AI 一个目标，让它提方案或安排步骤。','卡在空白页，或对任务不熟时，让 AI 提出几个开局方向。','让 AI 领路时也给它一个边界，比如「先给选项，我来挑」。'],
      ['自己定目标、步骤或标准，把其中几步交给 AI。','已经知道想要什么，或者成品有明确要求时，先说清楚哪些地方必须满足。','管得住格式，不代表管住了事实；留一点空间让 AI 提出你没想到的方案。']]},
    { title:'信任', question:'AI 给出回答后，你通常还会做什么？', sides:[
      ['先看回答是否说得通，够用就继续往下做。','取名字、发散灵感等低风险任务，可以先保留有意思的点子。','一旦要引用数据、文献或事实，就别只凭「看起来合理」判断。'],
      ['会查来源、试例子，或者检查答案的推理。','数据要写进报告、代码要投入使用时，核查关键出处或跑一遍测试。','不必逐字审查每条灵感。把验证时间留给判断错了会有后果的地方。']]}
  ]
};

let cfg = LOCAL;            // 优先使用后端下发，失败回退 LOCAL
let backend = false;        // 后端是否可用

const app = document.querySelector('#app');
const home = app.innerHTML;
let answers = [], step = 0, shareText = '';

async function loadConfig() {
  try {
    const res = await fetch('/api/questions');
    if (!res.ok) throw new Error('bad status');
    const remote = await res.json();
    cfg = { ...LOCAL, ...remote };
    backend = true;
  } catch { backend = false; }
}

function focusHeading() {
  app.querySelector('h2')?.focus();
  window.scrollTo(0,0);
}
function renderQuestion(moveFocus = true) {
  const [,prompt,options] = cfg.questions[step];
  app.innerHTML = `<section class="quiz">
  <div class="quiztop"><button class="link" data-action="home">← 首页</button><span class="counter">第 ${step + 1} / ${cfg.questions.length} 题</span></div>
  <div class="track" role="progressbar" aria-label="答题进度" aria-valuemin="0" aria-valuemax="9" aria-valuenow="${answers.filter(Number.isInteger).length}"><div style="width:${answers.filter(Number.isInteger).length / cfg.questions.length * 100}%"></div></div>
  <div class="panel"><p class="eyebrow"><span></span> 按你平时的做法选</p>
  <h2 tabindex="-1">${prompt}</h2>
  <div role="group" aria-label="选一个答案">${options.map((option,i) => `<button class="choice" data-action="choose" data-value="${i}" aria-pressed="${answers[step] === i}"><b aria-hidden="true">${i === 0 ? 'A' : 'B'}</b>${option}</button>`).join('')}</div>
  <div class="nav"><button class="link" data-action="back" ${step === 0 ? 'disabled' : ''}>上一题</button>
  <button class="primary" data-action="next" ${answers[step] === undefined ? 'disabled' : ''}>${step === cfg.questions.length - 1 ? '查看结果' : '下一题'} <span aria-hidden="true">→</span></button></div></div></section>`;
  if (moveFocus) focusHeading();
}
function scoreAxes(picks) {
  const sums = [0,0,0];
  cfg.questions.forEach(([axis], i) => { sums[axis] += picks[i]; });
  return sums;
}
function renderResult(rankInfo) {
  const scores = scoreAxes(answers);
  const bits = scores.map(score => Number(score >= 2));
  const code = bits.map((v,i) => cfg.letters[i][v]).join('');
  const tags = bits.map((v,i) => cfg.labels[i][v]);
  const [name,quote,desc,patch] = cfg.profiles[bits.join('')];
  shareText = `我的 MBAI 是「${name}」(${code})：${quote} 你也测测？${location.protocol === 'file:' ? '' : '\n' + new URL('./',location.href)}`;
  const rankLine = rankInfo && backend
    ? `<p class="community">✦ 你是本站第 <b>${rankInfo.rank}</b> 位「${name}」，目前共有 ${rankInfo.total} 人完成测试。</p>`
    : '';
  app.innerHTML = `<section class="result">
  <div class="panel result-card"><p class="eyebrow"><span></span> 你的 AI 使用人格</p>
  <span class="code">${code}</span><h2 tabindex="-1">${name}</h2>
  <div class="tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div>
  <p class="quote">“${quote}”</p><p class="desc">${desc}</p>
  <div class="patch"><small>✦ 今日人格补丁</small><p>${patch}</p></div>${rankLine}</div>
  <div class="actions"><button class="primary" data-action="copy">复制结果 <span aria-hidden="true">↗</span></button><button class="secondary" data-action="start">再测一次</button></div>
  <p id="copy-status" role="status"></p>
  ${renderScorecard(scores, bits)}
  ${renderBooklet()}
  <p class="note"><strong>关掉聊天窗口，你带走了什么？</strong><br>这个测试受一篇汇总 99 项高等教育研究的综述启发。它提醒我们：AI 可以帮你更快完成任务；自己判断、修改，再换个任务独立试一遍，才能更好地看出你学会了多少。</p>
  </section>`;
  focusHeading();
}
async function submitAndRender(code, name) {
  if (!backend) return renderResult(null);
  try {
    const res = await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, name, answers })
    });
    if (!res.ok) throw new Error();
    renderResult(await res.json());
  } catch { renderResult(null); }
}
function renderScorecard(scores, bits) {
  return `<section class="readout" aria-labelledby="score-title">
    <p class="eyebrow"><span></span> 01 / 得分报告</p>
    <h3 id="score-title">你的三条得分尺</h3>
    <p class="readout-intro">每个维度有 3 道题，选一次就给那一端加 1 分。得分较高的一端决定人格代码中的一个字母。</p>
    <ul class="score-list">${scores.map((right,i) => {
      const left = 3 - right;
      return `<li class="score-row">
        <div class="axis-heading"><strong>${cfg.guide[i].title}</strong><span>偏${cfg.labels[i][bits[i]]} · ${Math.max(left,right)}/3</span></div>
        <div class="axis-ends">
          <span>${cfg.labels[i][0]} <b>${left} 分</b></span>
          <span><b>${right} 分</b> ${cfg.labels[i][1]}</span>
        </div>
        <div class="score-strip" aria-hidden="true">${Array.from({length:3},(_,n) => `<span class="${n < left ? 'strip-left' : 'strip-right'}"></span>`).join('')}</div>
      </li>`;
    }).join('')}</ul>
    <p class="readout-foot">2∶1 表示略偏一侧；3∶0 表示这三题都选了同一端。分数只描述本次选择。</p>
  </section>`;
}
function renderBooklet() {
  return `<section class="readout booklet" aria-labelledby="guide-title">
    <p class="eyebrow"><span></span> 02 / 人机使用手册</p>
    <h3 id="guide-title">MBAI 使用小册子</h3>
    <p class="readout-intro">点开任一维度，看看两种倾向各适合什么场景。换个任务，你也可以换个用法。</p>
    ${cfg.guide.map((axis,i) => `<details class="chapter">
      <summary><span class="chapter-num">0${i+1}</span><span><strong>${axis.title} · ${cfg.labels[i].join(' ↔ ')}</strong><span class="chapter-question">${axis.question}</span></span></summary>
      <div class="chapter-body">${axis.sides.map(([habit, use, tip],side) => `<section class="side">
        <h4><span>${cfg.letters[i][side]}</span> ${cfg.labels[i][side]}</h4>
        <p>${habit}</p>
        <p><b>适用场景</b> ${use}</p>
        <p><b>使用提醒</b> ${tip}</p>
      </section>`).join('')}</div>
    </details>`).join('')}
  </section>`;
}
app.addEventListener('click', async event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  switch(button.dataset.action) {
    case 'start': answers = []; step = 0; renderQuestion(); break;
    case 'home': app.innerHTML = home; app.querySelector('[data-action=start]').focus(); window.scrollTo(0,0); break;
    case 'choose':
      answers[step] = Number(button.dataset.value);
      app.querySelectorAll('.choice').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
      app.querySelector('[data-action=next]').disabled = false;
      app.querySelector('.track').setAttribute('aria-valuenow', answers.filter(Number.isInteger).length);
      app.querySelector('.track div').style.width = answers.filter(Number.isInteger).length / cfg.questions.length * 100 + '%';
      break;
    case 'back': if (step > 0) { step--; renderQuestion(); } break;
    case 'next':
      if (answers[step] === undefined) break;
      if (step < cfg.questions.length - 1) { step++; renderQuestion(); }
      else {
        // 先算出 code/name 用于提交
        const scores = scoreAxes(answers);
        const bits = scores.map(s => Number(s >= 2));
        const code = bits.map((v,i) => cfg.letters[i][v]).join('');
        submitAndRender(code, cfg.profiles[bits.join('')][0]);
      }
      break;
    case 'copy': {
      const status = app.querySelector('#copy-status');
      try { await navigator.clipboard.writeText(shareText); status.textContent = '结果已复制。'; }
      catch { status.textContent = '可以手动复制：' + shareText; }
      break;
    }
  }
});
// 启动：拉取后端配置（题目文案统一管理；后端挂了也能玩）
loadConfig();
