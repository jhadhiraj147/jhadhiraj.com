import test from "node:test";
import assert from "node:assert/strict";
import { resolveTerminalCommand as run, completeTerminalInput as complete } from "../lib/portfolio-terminal.ts";

test("bare sections and explicit aliases resolve without changing directory", () => {
  for (const [command, topic] of Object.entries({about:"about", work:"experience", code:"projects", spotify:"beats", "?":"help"})) {
    assert.deepEqual(run(command,"~/skills"),{kind:"content",topic});
  }
  assert.deepEqual(run("   "),{kind:"noop"});
  assert.deepEqual(run("clear"),{kind:"clear"});
});

test("cd changes directory silently and understands home, parent, and virtual absolute paths", () => {
  assert.deepEqual(run("cd ~/projects"),{kind:"directory",directory:"~/projects"});
  assert.deepEqual(run("cd ../skills", "~/projects"),{kind:"directory",directory:"~/skills"});
  assert.deepEqual(run("cd /home/jhadhiraj147/beats"),{kind:"directory",directory:"~/beats"});
  assert.deepEqual(run("cd ..", "~/projects"),{kind:"directory",directory:"~"});
  assert.deepEqual(run("cd .."),{kind:"directory",directory:"~"});
  assert.deepEqual(run("cd"),{kind:"directory",directory:"~"});
  assert.deepEqual(run("cd ~", "~/projects"),{kind:"directory",directory:"~"});
  assert.deepEqual(run("cd .", "~/projects"),{kind:"directory",directory:"~/projects"});
  assert.equal(run("pwd", "~/projects").text,"/home/jhadhiraj147/projects");
  assert.deepEqual(run("whoami", "~/projects"),{kind:"text",text:"jhadhiraj147"});
});

test("cd - uses OLDPWD and prints the changed directory, with errors preserving state", () => {
  assert.deepEqual(run("cd -", "~"), {kind:"text",text:"cd: OLDPWD not set"});
  assert.deepEqual(run("cd -", "~", "~/projects"), {kind:"directory",directory:"~/projects",output:"/home/jhadhiraj147/projects"});
  assert.deepEqual(run("cd -", "~/projects", "~"), {kind:"directory",directory:"~",output:"/home/jhadhiraj147"});
  assert.deepEqual(run("cd -", "~", "~/../../etc"), {kind:"text",text:"cd: OLDPWD not set"});
  let current = "~";
  let previous;
  for (const command of ["cd projects", "cd ../beats", "cd -", "cd -"]) {
    const result = run(command, current, previous);
    assert.equal(result.kind, "directory");
    previous = current;
    current = result.directory;
  }
  assert.equal(current, "~/beats");
  assert.equal(previous, "~/projects");
  assert.match(run("cd missing", current, previous).text, /no such directory/);
});

test("portfolio home returns to the welcome directory without affecting Bash navigation", () => {
  assert.deepEqual(run("home", "~/projects"), {kind:"directory",directory:"~"});
  assert.match(run("home extra", "~/projects").text, /Usage/);
  assert.deepEqual(run("cd ..", "~/projects"), {kind:"directory",directory:"~"});
});

test("back and undo restore the previous terminal view without resolving a directory", () => {
  for (const command of ["back", "undo"]) {
    assert.deepEqual(run(command, "~/projects", "~/skills"), {kind:"back"});
    assert.deepEqual(run(command, "~"), {kind:"back"});
    assert.match(run(`${command} extra`, "~/projects").text, /Usage/);
  }
});

test("literal hint wrappers and balanced nested wrappers resolve like bare commands", () => {
  for (const input of ['"help"', "'help'", "[help]", "<help>", "  <help>  ", '["<help>"]', '[ "<help>" ]']) {
    assert.deepEqual(run(input), run("help"), input);
  }
  for (const command of ["home", "back", "undo", "clear", "credits", "resume"]) {
    for (const input of [`"${command}"`, `[${command}]`, `<${command}>`]) {
      assert.deepEqual(run(input, "~/projects", "~/skills"), run(command, "~/projects", "~/skills"), input);
    }
  }
  for (const input of ['""', "''", "[]", "<>", "[<>]", "  [ ]  "]) {
    assert.deepEqual(run(input), {kind:"noop"}, input);
  }
});

test("wrappers can surround a full command line or individual command and argument tokens", () => {
  for (const input of ['"cd skills"', "[cd skills]", "<cd skills>", '"cd" skills', "[cd] skills", "<cd> [skills]", "cd [skills]", 'cd "<skills>"']) {
    assert.deepEqual(run(input), {kind:"directory",directory:"~/skills"}, input);
  }
  assert.deepEqual(run('"cat" [README.md]', "~/skills"), {kind:"content",topic:"skills"});
  assert.deepEqual(run("[open] <resume>"), {kind:"open",target:"resume"});
  assert.match(run("[home] [extra]").text, /Usage/);
  assert.match(run("<cd> [skills] [projects]").text, /Usage/);
});

test("malformed or mismatched wrappers are not repaired into valid commands", () => {
  for (const input of ["<help", "help>", "[help", "help]", '"help', 'help"', "<help]", "[help>", '["help]', '"help\'', 'he"lp', "[hel]p"]) {
    const result = run(input);
    assert.equal(result.kind, "text", input);
    assert.notEqual(result.topic, "help", input);
    assert.deepEqual(complete(input), [], input);
  }
});

test("wrappers preserve command guards and virtual filesystem boundaries", () => {
  for (const input of ["<help> > output", "[help; resume]", '["help | resume"]', "<help && resume>", '"$(whoami)"', "[`whoami`]", "<help>\nresume", "<help>\\resume"]) {
    assert.equal(run(input).kind, "text", input);
    assert.deepEqual(complete(input), [], input);
  }
  for (const input of ["[cat] <~/.env.local>", '"/etc/passwd"', "[cd] <../../etc>", "<__proto__>"]) {
    const result = run(input);
    assert.equal(result.kind, "text", input);
    assert.match(result.text, /no such|not found/i, input);
  }
  const deeplyWrapped = "[".repeat(127) + "help" + "]".repeat(127);
  assert.match(run(deeplyWrapped).text, /too long/);
  assert.deepEqual(complete(deeplyWrapped), []);
});

test("virtual paths cannot traverse the real filesystem or prototype properties", () => {
  for (const command of ["cd ../../etc", "cat /etc/passwd", "cd __proto__", "__proto__", "constructor", "toString"]) {
    assert.equal(run(command).kind,"text");
    assert.match(run(command).text,/no such|not found/i);
  }
  assert.equal(run("pwd", "~/../../etc").text,"/home/jhadhiraj147");
});

test("absolute paths stay in virtual home and never alias unrelated root paths", () => {
  for (const command of ["cd /skills", "cd /etc/../skills", "cat /skills.txt", "cat /etc/../skills.txt", "cd /"]) {
    assert.equal(run(command).kind, "text", command);
    assert.match(run(command).text, /no such/i, command);
  }
  assert.deepEqual(run("cd /home/jhadhiraj147/skills"), {kind:"directory",directory:"~/skills"});
  assert.deepEqual(run("cat /home/jhadhiraj147/skills.txt"), {kind:"content",topic:"skills"});
  assert.deepEqual(complete("cd /sk"), []);
  assert.deepEqual(complete("cat /sk"), []);
});

test("path traversal requires existing intermediate directories", () => {
  for (const command of [
    "cat missing/../skills.txt", "cat skills.txt/../experience.log", "cat README.md/.",
    "cd missing/../skills", "cd skills.txt/../skills", "cat projects/missing/../README.md",
  ]) {
    assert.equal(run(command).kind, "text", command);
    assert.match(run(command).text, /no such/i, command);
  }
  assert.deepEqual(run("cat skills/../experience.log"), {kind:"content",topic:"experience"});
  assert.deepEqual(run("cd skills/../projects"), {kind:"directory",directory:"~/projects"});
  assert.deepEqual(complete("cat missing/../sk"), []);
  assert.deepEqual(complete("cd skills.txt/../pro"), []);
});

test("trailing slashes require directories rather than silently opening files", () => {
  assert.match(run("cat skills.txt/").text, /not a directory/);
  assert.match(run("cat ~/projects/README.md/").text, /not a directory/);
  assert.match(run("cat skills/").text, /is a directory/);
  assert.deepEqual(run("cd skills/"), {kind:"directory",directory:"~/skills"});
});

test("cat resolves virtual files and README in the current section", () => {
  assert.deepEqual(run("cat about.txt"),{kind:"content",topic:"about"});
  assert.deepEqual(run("cat experience.log"),{kind:"content",topic:"experience"});
  assert.deepEqual(run("cat README.md","~/projects"),{kind:"content",topic:"projects"});
  assert.deepEqual(run("cat ~/projects/flashfs.md"),{kind:"content",topic:"flashfs"});
  assert.deepEqual(run("cat /home/jhadhiraj147/about.txt"),{kind:"content",topic:"about"});
  assert.deepEqual(run("cat ../beats.log","~/projects"),{kind:"content",topic:"beats"});
  assert.deepEqual(run("cat resume.pdf"),{kind:"open",target:"resume"});
  assert.deepEqual(run("cat stack.conf", "~/skills"),{kind:"content",topic:"skills"});
  assert.deepEqual(run("cat experience.txt", "~/experience"),{kind:"content",topic:"experience"});
  assert.match(run("cat readme.md").text,/no such file/);
  assert.match(run("cat About.txt").text,/no such file/);
  assert.match(run("cat projects").text,/is a directory/);
  assert.match(run("cat missing/README.md").text,/no such file/);
});

test("root ls lists only simple public section names and each name works directly", () => {
  const names = ["skills", "experience", "projects", "flashfs", "education", "travel", "offtofly", "beats", "contact", "links"];
  const listed = run("ls").text.split(/\s+/);
  assert.deepEqual(listed, names);
  assert.deepEqual(run("ls -la"), run("ls"));
  assert(!/[./]/.test(run("ls").text));
  for (const topic of listed) assert.deepEqual(run(topic), {kind:"content",topic});
});

test("section ls lists compact read aliases and every listed name also works directly", () => {
  assert.deepEqual(run("ls projects"),{kind:"text",text:"README.md  projects.md  flashfs.md  offtofly.md"});
  assert.deepEqual(run("ls skills"),{kind:"text",text:"README.md  skills.txt"});
  assert.deepEqual(run("ls experience"),{kind:"text",text:"README.md  experience.log"});
  assert.deepEqual(run("ls","~/beats"),{kind:"text",text:"README.md  beats.log"});
  assert.deepEqual(run("ls -a","~/beats"),{kind:"text",text:".  ..  README.md  beats.log"});
  for (const section of ["about", "skills", "experience", "projects", "beats"]) {
    const directory = `~/${section}`;
    for (const filename of run("ls", directory).text.split(/\s+/)) {
      assert.equal(run(filename, directory).kind, "content", `${directory}/${filename} opens directly`);
    }
  }
  assert.match(run("ls missing").text,/no such directory/);
});

test("legacy filenames remain readable directly without exposing them in root ls", () => {
  assert(!run("ls").text.includes("skills.txt"));
  for (const [filename, topic] of Object.entries({"skills.txt":"skills", "stack.conf":"skills", "experience.log":"experience", "experience.txt":"experience", "about.md":"about", "README.md":"welcome"})) {
    assert.deepEqual(run(filename), {kind:"content",topic});
  }
  assert.deepEqual(run("~/skills.txt"), {kind:"content",topic:"skills"});
  assert.deepEqual(run("/home/jhadhiraj147/skills.txt"), {kind:"content",topic:"skills"});
  assert.deepEqual(run("skills/"), {kind:"content",topic:"skills"});
  assert.deepEqual(run("../skills/", "~/projects"), {kind:"content",topic:"skills"});
  assert.deepEqual(run("resume.pdf"), {kind:"open",target:"resume"});
  for (const command of ["~/.env.local", "~/private.txt", "/etc/passwd", "~/skills/.env"]) {
    assert.equal(run(command).kind, "text");
    assert.match(run(command).text, /no such file/);
  }
});

test("home replaces advertised about navigation while legacy reads stay compatible", () => {
  assert(!run("ls").text.split(/\s+/).includes("about"));
  assert.deepEqual(run("home"), {kind:"directory",directory:"~"});
  for (const command of ["about", "about.txt", "cat about.txt", "~/about.md", "cat ~/about/README.md"]) {
    assert.deepEqual(run(command), {kind:"content",topic:"about"});
  }
  assert.deepEqual(run("cd about"), {kind:"directory",directory:"~/about"});
  assert.match(run("about extra").text, /Usage/);
  for (const input of ["ab", "about.", "~/ab", "cd ab", "cd ~/ab", "cat ab", "cat ~/about/", "cat ../ab"]) {
    assert.deepEqual(complete(input), [], `${input} does not advertise the duplicate profile view`);
  }
  assert.deepEqual(complete("cat REA", "~/about"), []);
});

test("external actions are limited to named public portfolio destinations", () => {
  for (const target of ["resume","github","linkedin","email","instagram"]) {
    assert.deepEqual(run(target),{kind:"open",target});
    assert.deepEqual(run(`open ${target}`),{kind:"open",target});
  }
  assert.deepEqual(run("open resume.pdf"),{kind:"open",target:"resume"});
  assert.match(run("open https://example.com").text,/Usage/);
  assert.match(run("credits").text,/WebPlus IBM VGA 8x16.*CC BY-SA 4.0/);
});

test("unsupported arguments and shell syntax are rejected rather than partially executed", () => {
  for(const command of ["projects unexpected","cd about projects","cat about.txt beats.log","help extra","clear extra"]) assert.match(run(command).text,/Usage/);
  for(const command of ["projects; github","cat /etc/passwd | x","$(whoami)","about\nresume","about && github"]) {
    assert.equal(run(command).kind,"text");
    assert.notEqual(run(command).topic,"about");
  }
  assert.match(run("x".repeat(257)).text,/too long/);
});

test("completion returns full valid command lines and does not capture unrelated Tab input", () => {
  assert.deepEqual(complete("pro"),["projects"]);
  assert.deepEqual(complete("cd pro"),["cd projects/"]);
  assert.deepEqual(complete("cd ~/bea"),["cd ~/beats/"]);
  assert.deepEqual(complete("cat exper"),["cat experience.log"]);
  assert.deepEqual(complete("cat ~/projects/fla"),["cat ~/projects/flashfs.md"]);
  assert.deepEqual(complete("cat REA","~/beats"),["cat README.md"]);
  assert.deepEqual(complete("cat rea","~/beats"),[]);
  assert.deepEqual(complete("cd -","~/beats"),["cd -"]);
  assert.deepEqual(complete("cd ../pro","~/beats"),["cd ../projects/"]);
  assert.deepEqual(complete("ba"),["back"]);
  assert.deepEqual(complete("un"),["undo"]);
  assert.deepEqual(complete("CD pro"),[]);
  assert.deepEqual(complete("open res"),["open resume"]);
  assert.deepEqual(complete("gibberish"),[]);
  assert.deepEqual(complete("about argument"),[]);
  assert.deepEqual(complete("cat /etc/pa"),[]);
  assert.deepEqual(complete("cd x;"),[]);
  assert.deepEqual(complete("skills.t"),["skills.txt"]);
  assert.deepEqual(complete("~/skills.t"),["~/skills.txt"]);
  assert.deepEqual(complete("READ", "~/skills"),["README.md"]);
  assert.deepEqual(complete("~/.env"),[]);
});

test("completion understands balanced hint wrappers and returns executable command lines", () => {
  for (const input of ['"pro"', "[pro]", "<pro>", '["<pro>"]']) {
    assert.deepEqual(complete(input), ["projects"], input);
  }
  for (const input of ['"cd pro"', "[cd] <pro>", "cd [pro]"]) {
    assert.deepEqual(complete(input), ["cd projects/"], input);
  }
  assert.deepEqual(complete("[cat] <REA>", "~/beats"), ["cat README.md"]);
  assert.deepEqual(complete("<open> [res]"), ["open resume"]);
  assert.deepEqual(complete("[cd] "), complete("cd "));
});

test("commands and directory names are case-sensitive like a Linux shell", () => {
  assert.match(run("CD projects").text, /Command not found/);
  assert.match(run("cd Projects").text, /no such directory/);
  assert.match(run("HELP").text, /Command not found/);
});
