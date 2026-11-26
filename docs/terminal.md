# Portfolio terminal

The website's interface is a virtual terminal with familiar Bash navigation.
It models a read-only portfolio filesystem inside `/home/jhadhiraj147`; it is not a
complete Arch installation or a Bash interpreter. Commands never execute OS
programs or read local files. The resume action opens the public PDF shipped
with the site.

The screen has no separate window title bar. One `Arch Linux tty1` banner and
`archlinux login: jhadhiraj147` line precede the session transcript. The hostname
matches the shell prompt, `[jhadhiraj147@archlinux ~]$`. A topic command such as
`experience` prints content without changing `~`; `cd experience` changes the
prompt directory. Earlier output remains in scrollback. The command input has
an accessible name through `aria-label`, so copying the transcript does not add
the screen reader label to the visible prompt.

Commands:

- `help` lists the available portfolio commands.
- `ls` at home shows only the simple public section names below. Type any name
  from that list to read it directly; no filename extensions are required.
- `home` shows Dhiraj Jha's profile and original welcome screen.
- `skills`, `experience`, `projects`, `flashfs`, `education`, `travel`,
  `offtofly`, `beats`, `contact`, and `links` display the corresponding content.
- `cd projects` changes the virtual directory silently. Use `ls` to list its
  files, then `cat README.md` to read its content.
- `cd ..` moves up one level. `cd ~` or `cd` returns to the virtual home.
  The home directory is the boundary of this small filesystem. Absolute paths
  must begin with `/home/jhadhiraj147`; `/skills` does not alias `~/skills`.
  Intermediate path components must be existing directories, and a trailing
  slash cannot turn a virtual file into a directory.
- `cd -` switches to the previous directory and prints its absolute path,
  matching Bash's `OLDPWD` behavior. Another `cd -` switches back.
- Inside a section, `ls` shows a compact set of read aliases, such as
  `README.md` and `skills.txt`. Every displayed alias also works when typed
  directly. `ls projects` lists its aliases without changing directory.
- `pwd` prints the current virtual path.
- `whoami` prints `jhadhiraj147`, the virtual user name. The prompt uses
  `jhadhiraj147@archlinux`; use `home` for Dhiraj Jha's profile.
- `cat README.md` displays the current section. Files such as `skills.txt`,
  `experience.log`, `beats.log`, and `resume.pdf` work from home; absolute home
  paths such as `cat ~/experience.log` work from other sections.
- `resume`, `github`, `linkedin`, `email`, and `instagram` open named destinations.
  `open resume` and `open github` are equivalent forms.
  Each result also supplies a normal link if the browser blocks the new tab or
  the visitor needs to retry. The interface says "Opening" rather than claiming
  the browser successfully opened another application.
- `clear` clears command output and the profile, keeping the logged-in banner
  and current directory. The active shell prompt sits directly below the banner.
  Ctrl+L and the `[clear]` shortcut use the same behavior.
- `credits` displays the console font attribution and license location.

Portfolio shortcuts, rather than standard Bash builtins:

- `home` returns to `~` and restores the original welcome screen.
- `back` or `undo` restores the previous terminal view, including its content,
  current directory, previous-directory state, and scroll position. It can also
  restore the view from before `clear` or `home`. Command recall remains
  available with Up/Down after going back. This is a portfolio navigation
  shortcut, distinct from the parent-directory command `cd ..`.
- Topic names such as `projects` and `experience` display portfolio content
  directly without changing directory. `resume`, `github`, and other named
  external actions are also portfolio commands.
- Older read aliases such as `skills.txt`, `stack.conf`, `experience.log`,
  `README.md`, and `~/skills.txt` work directly as well as with `cat`.
  They display the same public portfolio content; they are not real files on
  the host. Duplicate aliases remain compatible without cluttering `ls`.
- `about`, `about.txt`, and their older paths remain compatible for existing
  commands, but are omitted from `ls` and completion because Home already shows
  the profile.
- Literal hint wrappers are accepted: `"help"`, `'help'`, `[help]`, and `<help>`
  all run `help`. Balanced wrappers may surround a full command such as
  `"cd skills"`, individual tokens such as `[cd] <skills>`, or be nested as
  `["<help>"]`. This lets visitors copy the input hint directly. Mismatched or
  incomplete wrappers are rejected; empty wrappers behave like an empty input.

Commands and paths are case-sensitive, as on Linux. Use `README.md`, not
`readme.md`. The interface supports a small navigation subset, not all Bash
syntax, GNU command options, pipes, redirection, or shell scripts.
The hint wrappers are a portfolio convenience; `<help>` does not redirect input.
Adding shell operators still produces an error, including `<help> > output`.

Example:

```text
ls
skills
skills.txt
cd projects
ls
README.md
cd ..
cd -
cd ~
back
```

The bottom `[back]` shortcut performs the same action as typing `back`. Use it
to undo the latest navigation change; use `cd ..` to move to a parent directory.
When no earlier terminal view is available, there is nothing to restore.

The session keeps at most 100 command-output entries, 100 recalled commands, and
30 undo snapshots in browser memory. Older entries are discarded as new commands
arrive; undo snapshots share the existing entry objects. `clear` and `home` are
undoable within those 30 snapshots. Reloading starts a new session.

The navigation behavior follows the [Bash builtins reference](https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html)
and the [Arch Bash manual page](https://man.archlinux.org/man/bash.1.html).

Tab completion returns full command-line candidates. The UI can replace a unique
candidate and display multiple matches; when no match exists, Tab retains normal
keyboard focus navigation. Balanced wrapped prefixes work too: `<pro>` completes
to `projects`, and `[cd] <pro>` completes to `cd projects/`. Completion removes
the optional wrappers from its suggestions. Up/Down history, Escape, and
transcript scrolling are handled by the terminal component. Multiple completion
candidates keep focus in the input; Shift+Tab or an input with no matches retains
normal browser focus navigation. IME composition keys are not intercepted as
terminal shortcuts. Ctrl+C copies selected command text normally; without a
selection it cancels the draft, like a shell interrupt.

Parser implementation: `lib/portfolio-terminal.ts`.

```sh
node --experimental-strip-types --test tests/portfolio-terminal.test.mjs
```
