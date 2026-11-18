// Small dependency-free syntax highlighter producing VS Code Dark+ style tokens.
const Highlighter = (() => {
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const span = (cls, s) => `<span class="tok-${cls}">${esc(s)}</span>`;
  const set = s => new Set(s.split(/\s+/).filter(Boolean));

  const EOI = '(?![\\s\\S])';
  const STR = String.raw`"(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?`;
  const STR_DQ = String.raw`"(?:\\.|[^"\\\n])*"?`;
  const TPL = '`(?:\\\\[\\s\\S]|[^`\\\\])*`?';
  const C_COMMENT = String.raw`\/\/[^\n]*|\/\*[\s\S]*?(?:\*\/|` + EOI + ')';
  const NUM = String.raw`\b(?:0[xX][\da-fA-F_]+|\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?)\b`;
  const WORD = String.raw`[A-Za-z_$][\w$]*`;
  const DECO = String.raw`@[A-Za-z_][\w.]*`;

  const lang = d => ({
    comment: d.comment, string: d.string, extra: d.extra, extraCls: d.extraCls || 'function',
    kw: set(d.kw || ''), ctl: set(d.ctl || ''), types: set(d.types || ''), fn: set(d.fn || ''),
    ci: !!d.ci, noType: !!d.noType, plain: !!d.plain, keys: !!d.keys,
  });

  const JS_KW = 'var let const function class extends new this super typeof instanceof delete void static get set async of in as true false null undefined NaN Infinity debugger';
  const JS_CTL = 'if else for while do return import from export switch case break continue try catch finally throw await yield default';

  const defs = {
    javascript: lang({ comment: C_COMMENT, string: STR + '|' + TPL, kw: JS_KW, ctl: JS_CTL }),
    typescript: lang({
      comment: C_COMMENT, string: STR + '|' + TPL, extra: DECO,
      kw: JS_KW + ' type interface enum implements public private protected readonly abstract namespace declare keyof is infer',
      ctl: JS_CTL, types: 'string number boolean any unknown never object symbol bigint',
    }),
    python: lang({
      comment: String.raw`#[^\n]*`, extra: DECO,
      string: `"""[\\s\\S]*?(?:"""|${EOI})|'''[\\s\\S]*?(?:'''|${EOI})|` + STR,
      kw: 'def class lambda None True False and or not is in global nonlocal async self cls',
      ctl: 'if elif else for while return import from try except finally raise with assert break continue pass yield await del as',
      types: 'int str float bool list dict set tuple bytes object type',
    }),
    java: lang({
      comment: C_COMMENT, string: STR, extra: DECO,
      kw: 'public private protected class interface extends implements static final abstract void new this super null true false enum instanceof synchronized volatile transient var record',
      ctl: 'if else for while do return import switch case break continue try catch finally throw throws default package',
      types: 'int long double float boolean char byte short',
    }),
    csharp: lang({
      comment: C_COMMENT, string: STR,
      kw: 'namespace public private protected internal class struct interface enum static readonly const void new this base null true false var async override virtual abstract sealed partial get set value is as in out ref params delegate event',
      ctl: 'if else for foreach while do return using switch case break continue try catch finally throw default await yield',
      types: 'int long double float bool char byte short string object decimal',
    }),
    cpp: lang({
      comment: C_COMMENT, string: STR, extra: String.raw`#[ \t]*[a-z]+`, extraCls: 'control',
      kw: 'class struct enum union namespace template typename public private protected virtual static const constexpr auto new delete this nullptr true false using typedef sizeof inline operator',
      ctl: 'if else for while do return switch case break continue try catch throw default goto',
      types: 'int long double float bool char short void unsigned signed size_t string vector',
    }),
    go: lang({
      comment: C_COMMENT, string: STR_DQ + '|' + '`[^`]*`?',
      kw: 'func var const type struct interface map chan nil true false iota make new len cap append',
      ctl: 'if else for range return import package switch case break continue select go defer default goto fallthrough',
      types: 'int int8 int16 int32 int64 uint uint8 uint16 uint32 uint64 float32 float64 string bool byte rune error any',
    }),
    rust: lang({
      comment: C_COMMENT, string: STR_DQ,
      kw: 'fn let mut const struct enum impl trait pub self Self static true false as where dyn unsafe async move ref type',
      ctl: 'if else for while loop return use match break continue mod crate in await',
      types: 'i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str String Vec Option Result Box',
    }),
    sql: lang({
      comment: String.raw`--[^\n]*|\/\*[\s\S]*?(?:\*\/|` + EOI + ')', string: String.raw`'(?:''|[^'])*'?`,
      ci: true, noType: true, plain: true,
      kw: 'select from where insert into values update set delete create table alter drop join inner left right outer full cross on group by order having limit offset as and or not null is in like between distinct union all case when then else end primary key foreign references index view database count sum avg min max asc desc exists with int integer varchar text date timestamp boolean default unique constraint add column top',
    }),
    bash: lang({
      comment: String.raw`#[^\n]*`, string: STR, plain: true, noType: true,
      extra: String.raw`\$\{[^}\n]*\}|\$[\w@#?*!$-]+`, extraCls: 'var',
      kw: 'function local readonly export alias unset set',
      ctl: 'if then else elif fi for while until do done case esac return exit break continue in',
      fn: 'echo cd ls mkdir rm cp mv cat grep sed awk curl wget git npm npx pip python python3 node docker sudo chmod kill source touch find',
    }),
    json: lang({
      comment: '(?!)', string: STR_DQ, kw: 'true false null', plain: true, noType: true, keys: true,
    }),
  };

  const aliases = {
    js: 'javascript', jsx: 'javascript', node: 'javascript', ts: 'typescript', tsx: 'typescript',
    py: 'python', cs: 'csharp', 'c#': 'csharp', c: 'cpp', 'c++': 'cpp', cc: 'cpp', h: 'cpp',
    golang: 'go', rs: 'rust', sh: 'bash', shell: 'bash', zsh: 'bash', powershell: 'bash',
    xml: 'html', htm: 'html', scss: 'css', text: 'text', txt: 'text', plain: 'text',
  };
  const known = new Set([...Object.keys(defs), 'html', 'css', 'text']);

  function normalize(name) {
    const n = (name || '').toLowerCase();
    const r = aliases[n] || n;
    return known.has(r) ? r : null;
  }

  function generic(code, def) {
    if (!def.re) {
      const NEVER = '(?!)';
      def.re = new RegExp(
        `(${def.comment})|(${def.string})|(${def.extra || NEVER})|(${NUM})|(${WORD})|([\\s\\S])`, 'gm');
    }
    const re = def.re;
    re.lastIndex = 0;
    let out = '', plain = '', m;
    const flush = () => { if (plain) { out += esc(plain); plain = ''; } };
    const after = n => code.slice(re.lastIndex, re.lastIndex + n);

    while ((m = re.exec(code))) {
      if (m[1] !== undefined) { flush(); out += span('comment', m[1]); }
      else if (m[2] !== undefined) {
        flush();
        out += span(def.keys && /^\s*:/.test(after(40)) ? 'prop' : 'string', m[2]);
      }
      else if (m[3] !== undefined) { flush(); out += span(def.extraCls, m[3]); }
      else if (m[4] !== undefined) { flush(); out += span('number', m[4]); }
      else if (m[5] !== undefined) {
        const w = m[5], key = def.ci ? w.toLowerCase() : w;
        let cls = null;
        if (def.ctl.has(key)) cls = 'control';
        else if (def.kw.has(key)) cls = 'keyword';
        else if (def.types.has(w)) cls = 'type';
        else if (def.fn.has(w) || /^[ \t]*\(/.test(after(20))) cls = 'function';
        else if (!def.noType && /^[A-Z]\w*[a-z]\w*$/.test(w)) cls = 'type';
        else if (!def.plain) cls = 'var';
        if (cls) { flush(); out += span(cls, w); } else plain += w;
      }
      else plain += m[6];
    }
    flush();
    return out;
  }

  function html(code) {
    const re = /(<!--[\s\S]*?(?:-->|(?![\s\S])))|(<\/?)([A-Za-z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)(\/?>)?/g;
    let out = '', last = 0, m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      last = re.lastIndex;
      if (m[1] !== undefined) { out += span('comment', m[1]); continue; }
      out += span('punct', m[2]) + span('tag', m[3]);
      out += m[4].replace(/([^\s=\/"'<>]+)|(=)|("[^"]*"|'[^']*')|([\s\S])/g,
        (all, name, eq, str) => name ? span('attr', name) : str ? span('string', str) : esc(all));
      if (m[5]) out += span('punct', m[5]);
    }
    return out + esc(code.slice(last));
  }

  function css(code) {
    const re = /(\/\*[\s\S]*?(?:\*\/|(?![\s\S])))|("(?:\\.|[^"\\\n])*"?|'(?:\\.|[^'\\\n])*'?)|(@[\w-]+)|([{}])|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|%|vh|vw|s|ms|deg|fr|ch)?)|([\w-]+)|([\s\S])/g;
    let depth = 0, out = '', m;
    while ((m = re.exec(code))) {
      if (m[1]) out += span('comment', m[1]);
      else if (m[2]) out += span('string', m[2]);
      else if (m[3]) out += span('control', m[3]);
      else if (m[4]) { depth = m[4] === '{' ? depth + 1 : Math.max(0, depth - 1); out += esc(m[4]); }
      else if (depth === 0) out += /^\s+$/.test(m[0]) ? esc(m[0]) : span('sel', m[0]);
      else if (m[5]) out += span('number', m[5]);
      else if (m[6]) {
        const isProp = /^\s*:/.test(code.slice(re.lastIndex, re.lastIndex + 30));
        out += span(isProp ? 'prop' : 'cssval', m[6]);
      }
      else out += esc(m[7]);
    }
    return out;
  }

  function highlight(code, language) {
    const l = normalize(language);
    try {
      if (l === 'html') return html(code);
      if (l === 'css') return css(code);
      if (l && defs[l]) return generic(code, defs[l]);
    } catch (e) { /* fall through to plain text */ }
    return esc(code);
  }

  return { highlight, normalize, escape: esc };
})();
