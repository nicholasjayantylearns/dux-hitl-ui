# Manage Claude's memory

> Learn how to manage Claude Code's memory across sessions with different memory locations and best practices.

Claude Code can remember your preferences across sessions, like style guidelines and common commands in your workflow.

## Determine memory type

Claude Code offers four memory locations in a hierarchical structure, each serving a different purpose:

| Memory Type                | Location                                                                                                                                                | Purpose                                             | Use Case Examples                                                    | Shared With                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------- |
| **Enterprise policy**      | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`<br />Linux: `/etc/claude-code/CLAUDE.md`<br />Windows: `C:\ProgramData\ClaudeCode\CLAUDE.md` | Organization-wide instructions managed by IT/DevOps | Company coding standards, security policies, compliance requirements | All users in organization       |
| **Project memory**         | `./CLAUDE.md` or `./.claude/CLAUDE.md`                                                                                                                  | Team-shared instructions for the project            | Project architecture, coding standards, common workflows             | Team members via source control |
| **User memory**            | `~/.claude/CLAUDE.md`                                                                                                                                   | Personal preferences for all projects               | Code styling preferences, personal tooling shortcuts                 | Just you (all projects)         |
| **Project memory (local)** | `./CLAUDE.local.md`                                                                                                                                     | Personal project-specific preferences               | *(Deprecated, see below)* Your sandbox URLs, preferred test data     | Just you (current project)      |

All memory files are automatically loaded into Claude Code's context when launched. Files higher in the hierarchy take precedence and are loaded first, providing a foundation that more specific memories build upon.

## CLAUDE.md imports

CLAUDE.md files can import additional files using `@path/to/import` syntax. The following example imports 3 files:

```
See @README for project overview and @package.json for available npm commands for this project.

# Additional Instructions
- git workflow @docs/git-instructions.md
```

Both relative and absolute paths are allowed. In particular, importing files in user's home dir is a convenient way for your team members to provide individual instructions that are not checked into the repository. Previously CLAUDE.local.md served a similar purpose, but is now deprecated in favor of imports since they work better across multiple git worktrees.

```
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

To avoid potential collisions, imports are not evaluated inside markdown code spans and code blocks.

```
This code span will not be treated as an import: `@anthropic-ai/claude-code`
```

Imported files can recursively import additional files, with a max-depth of 5 hops. You can see what memory files are loaded by running `/memory` command.

## How Claude looks up memories

Claude Code reads memories recursively: starting in the cwd, Claude Code recurses up to (but not including) the root directory */* and reads any CLAUDE.md or CLAUDE.local.md files it finds. This is especially convenient when working in large repositories where you run Claude Code in *foo/bar/*, and have memories in both *foo/CLAUDE.md* and *foo/bar/CLAUDE.md*.

Claude will also discover CLAUDE.md nested in subtrees under your current working directory. Instead of loading them at launch, they are only included when Claude reads files in those subtrees.

## Quickly add memories with the `#` shortcut

The fastest way to add a memory is to start your input with the `#` character:

```
# Always use descriptive variable names
```

You'll be prompted to select which memory file to store this in.

## Directly edit memories with `/memory`

Use the `/memory` slash command during a session to open any memory file in your system editor for more extensive additions or organization.

## Set up project memory

Suppose you want to set up a CLAUDE.md file to store important project information, conventions, and frequently used commands. Project memory can be stored in either `./CLAUDE.md` or `./.claude/CLAUDE.md`.

Bootstrap a CLAUDE.md for your codebase with the following command:

```
> /init 
```

<Tip>
  Tips:

  * Include frequently used commands (build, test, lint) to avoid repeated searches
  * Document code style preferences and naming conventions
  * Add important architectural patterns specific to your project
  * CLAUDE.md memories can be used for both instructions shared with your team and for your individual preferences.
</Tip>

## Organization-level memory management

Enterprise organizations can deploy centrally managed CLAUDE.md files that apply to all users.

To set up organization-level memory management:

1. Create the enterprise memory file in the appropriate location for your operating system:

* macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`
* Linux/WSL: `/etc/claude-code/CLAUDE.md`
* Windows: `C:\ProgramData\ClaudeCode\CLAUDE.md`

2. Deploy via your configuration management system (MDM, Group Policy, Ansible, etc.) to ensure consistent distribution across all developer machines.

## Memory best practices

* **Be specific**: "Use 2-space indentation" is better than "Format code properly".
* **Use structure to organize**: Format each individual memory as a bullet point and group related memories under descriptive markdown headings.
* **Review periodically**: Update memories as your project evolves to ensure Claude is always using the most up to date information and context.

# Subagents

> Create and use specialized AI subagents in Claude Code for task-specific workflows and improved context management.

Custom subagents in Claude Code are specialized AI assistants that can be invoked to handle specific types of tasks. They enable more efficient problem-solving by providing task-specific configurations with customized system prompts, tools and a separate context window.

## What are subagents?

Subagents are pre-configured AI personalities that Claude Code can delegate tasks to. Each subagent:

* Has a specific purpose and expertise area
* Uses its own context window separate from the main conversation
* Can be configured with specific tools it's allowed to use
* Includes a custom system prompt that guides its behavior

When Claude Code encounters a task that matches a subagent's expertise, it can delegate that task to the specialized subagent, which works independently and returns results.

## Key benefits

<CardGroup cols={2}>
  <Card title="Context preservation" icon="layer-group">
    Each subagent operates in its own context, preventing pollution of the main conversation and keeping it focused on high-level objectives.
  </Card>

  <Card title="Specialized expertise" icon="brain">
    Subagents can be fine-tuned with detailed instructions for specific domains, leading to higher success rates on designated tasks.
  </Card>

  <Card title="Reusability" icon="rotate">
    Once created, subagents can be used across different projects and shared with your team for consistent workflows.
  </Card>

  <Card title="Flexible permissions" icon="shield-check">
    Each subagent can have different tool access levels, allowing you to limit powerful tools to specific subagent types.
  </Card>
</CardGroup>

## Quick start

To create your first subagent:

<Steps>
  <Step title="Open the subagents interface">
    Run the following command:

    ```
    /agents
    ```
  </Step>

  <Step title="Select 'Create New Agent'">
    Choose whether to create a project-level or user-level subagent
  </Step>

  <Step title="Define the subagent">
    * **Recommended**: Generate with Claude first, then customize to make it yours
    * Describe your subagent in detail and when it should be used
    * Select the tools you want to grant access to (or leave blank to inherit all tools)
    * The interface shows all available tools, making selection easy
    * If you're generating with Claude, you can also edit the system prompt in your own editor by pressing `e`
  </Step>

  <Step title="Save and use">
    Your subagent is now available! Claude will use it automatically when appropriate, or you can invoke it explicitly:

    ```
    > Use the code-reviewer subagent to check my recent changes
    ```
  </Step>
</Steps>

## Subagent configuration

### File locations

Subagents are stored as Markdown files with YAML frontmatter in two possible locations:

| Type                  | Location            | Scope                         | Priority |
| :-------------------- | :------------------ | :---------------------------- | :------- |
| **Project subagents** | `.claude/agents/`   | Available in current project  | Highest  |
| **User subagents**    | `~/.claude/agents/` | Available across all projects | Lower    |

When subagent names conflict, project-level subagents take precedence over user-level subagents.

### Plugin agents

[Plugins](/en/docs/claude-code/plugins) can provide custom subagents that integrate seamlessly with Claude Code. Plugin agents work identically to user-defined agents and appear in the `/agents` interface.

**Plugin agent locations**: Plugins include agents in their `agents/` directory (or custom paths specified in the plugin manifest).

**Using plugin agents**:

* Plugin agents appear in `/agents` alongside your custom agents
* Can be invoked explicitly: "Use the code-reviewer agent from the security-plugin"
* Can be invoked automatically by Claude when appropriate
* Can be managed (viewed, inspected) through `/agents` interface

See the [plugin components reference](/en/docs/claude-code/plugins-reference#agents) for details on creating plugin agents.

### CLI-based configuration

You can also define subagents dynamically using the `--agents` CLI flag, which accepts a JSON object:

```bash  theme={null}
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

**Priority**: CLI-defined subagents have lower priority than project-level subagents but higher priority than user-level subagents.

**Use case**: This approach is useful for:

* Quick testing of subagent configurations
* Session-specific subagents that don't need to be saved
* Automation scripts that need custom subagents
* Sharing subagent definitions in documentation or scripts

For detailed information about the JSON format and all available options, see the [CLI reference documentation](/en/docs/claude-code/cli-reference#agents-flag-format).

### File format

Each subagent is defined in a Markdown file with this structure:

```markdown  theme={null}
---
name: your-sub-agent-name
description: Description of when this subagent should be invoked
tools: tool1, tool2, tool3  # Optional - inherits all tools if omitted
model: sonnet  # Optional - specify model alias or 'inherit'
---

Your subagent's system prompt goes here. This can be multiple paragraphs
and should clearly define the subagent's role, capabilities, and approach
to solving problems.

Include specific instructions, best practices, and any constraints
the subagent should follow.
```

#### Configuration fields

| Field         | Required | Description                                                                                                                                                                                                                      |
| :------------ | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Yes      | Unique identifier using lowercase letters and hyphens                                                                                                                                                                            |
| `description` | Yes      | Natural language description of the subagent's purpose                                                                                                                                                                           |
| `tools`       | No       | Comma-separated list of specific tools. If omitted, inherits all tools from the main thread                                                                                                                                      |
| `model`       | No       | Model to use for this subagent. Can be a model alias (`sonnet`, `opus`, `haiku`) or `'inherit'` to use the main conversation's model. If omitted, defaults to the [configured subagent model](/en/docs/claude-code/model-config) |

### Model selection

The `model` field allows you to control which [AI model](/en/docs/claude-code/model-config) the subagent uses:

* **Model alias**: Use one of the available aliases: `sonnet`, `opus`, or `haiku`
* **`'inherit'`**: Use the same model as the main conversation (useful for consistency)
* **Omitted**: If not specified, uses the default model configured for subagents (`sonnet`)

<Note>
  Using `'inherit'` is particularly useful when you want your subagents to adapt to the model choice of the main conversation, ensuring consistent capabilities and response style throughout your session.
</Note>

### Available tools

Subagents can be granted access to any of Claude Code's internal tools. See the [tools documentation](/en/docs/claude-code/settings#tools-available-to-claude) for a complete list of available tools.

<Tip>
  **Recommended:** Use the `/agents` command to modify tool access - it provides an interactive interface that lists all available tools, including any connected MCP server tools, making it easier to select the ones you need.
</Tip>

You have two options for configuring tools:

* **Omit the `tools` field** to inherit all tools from the main thread (default), including MCP tools
* **Specify individual tools** as a comma-separated list for more granular control (can be edited manually or via `/agents`)

**MCP Tools**: Subagents can access MCP tools from configured MCP servers. When the `tools` field is omitted, subagents inherit all MCP tools available to the main thread.

## Managing subagents

### Using the /agents command (Recommended)

The `/agents` command provides a comprehensive interface for subagent management:

```
/agents
```

This opens an interactive menu where you can:

* View all available subagents (built-in, user, and project)
* Create new subagents with guided setup
* Edit existing custom subagents, including their tool access
* Delete custom subagents
* See which subagents are active when duplicates exist
* **Easily manage tool permissions** with a complete list of available tools

### Direct file management

You can also manage subagents by working directly with their files:

```bash  theme={null}
# Create a project subagent
mkdir -p .claude/agents
echo '---
name: test-runner
description: Use proactively to run tests and fix failures
---

You are a test automation expert. When you see code changes, proactively run the appropriate tests. If tests fail, analyze the failures and fix them while preserving the original test intent.' > .claude/agents/test-runner.md

# Create a user subagent
mkdir -p ~/.claude/agents
# ... create subagent file
```

## Using subagents effectively

### Automatic delegation

Claude Code proactively delegates tasks based on:

* The task description in your request
* The `description` field in subagent configurations
* Current context and available tools

<Tip>
  To encourage more proactive subagent use, include phrases like "use PROACTIVELY" or "MUST BE USED" in your `description` field.
</Tip>

### Explicit invocation

Request a specific subagent by mentioning it in your command:

```
> Use the test-runner subagent to fix failing tests
> Have the code-reviewer subagent look at my recent changes
> Ask the debugger subagent to investigate this error
```

## Example subagents

### Code reviewer

```markdown  theme={null}
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is simple and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

### Debugger

```markdown  theme={null}
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not just symptoms.
```

### Data scientist

```markdown  theme={null}
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data

Always ensure queries are efficient and cost-effective.
```

## Best practices

* **Start with Claude-generated agents**: We highly recommend generating your initial subagent with Claude and then iterating on it to make it personally yours. This approach gives you the best results - a solid foundation that you can customize to your specific needs.

* **Design focused subagents**: Create subagents with single, clear responsibilities rather than trying to make one subagent do everything. This improves performance and makes subagents more predictable.

* **Write detailed prompts**: Include specific instructions, examples, and constraints in your system prompts. The more guidance you provide, the better the subagent will perform.

* **Limit tool access**: Only grant tools that are necessary for the subagent's purpose. This improves security and helps the subagent focus on relevant actions.

* **Version control**: Check project subagents into version control so your team can benefit from and improve them collaboratively.

## Advanced usage

### Chaining subagents

For complex workflows, you can chain multiple subagents:

```
> First use the code-analyzer subagent to find performance issues, then use the optimizer subagent to fix them
```

### Dynamic subagent selection

Claude Code intelligently selects subagents based on context. Make your `description` fields specific and action-oriented for best results.

## Performance considerations

* **Context efficiency**: Agents help preserve main context, enabling longer overall sessions
* **Latency**: Subagents start off with a clean slate each time they are invoked and may add latency as they gather context that they require to do their job effectively.

## Related documentation

* [Plugins](/en/docs/claude-code/plugins) - Extend Claude Code with custom agents through plugins
* [Slash commands](/en/docs/claude-code/slash-commands) - Learn about other built-in commands
* [Settings](/en/docs/claude-code/settings) - Configure Claude Code behavior
* [Hooks](/en/docs/claude-code/hooks) - Automate workflows with event handlers

# Agent Skills

> Create, manage, and share Skills to extend Claude's capabilities in Claude Code.

This guide shows you how to create, use, and manage Agent Skills in Claude Code. Skills are modular capabilities that extend Claude's functionality through organized folders containing instructions, scripts, and resources.

## Prerequisites

* Claude Code version 1.0 or later
* Basic familiarity with [Claude Code](/en/docs/claude-code/quickstart)

## What are Agent Skills?

Agent Skills package expertise into discoverable capabilities. Each Skill consists of a `SKILL.md` file with instructions that Claude reads when relevant, plus optional supporting files like scripts and templates.

**How Skills are invoked**: Skills are **model-invoked**—Claude autonomously decides when to use them based on your request and the Skill's description. This is different from slash commands, which are **user-invoked** (you explicitly type `/command` to trigger them).

**Benefits**:

* Extend Claude's capabilities for your specific workflows
* Share expertise across your team via git
* Reduce repetitive prompting
* Compose multiple Skills for complex tasks

Learn more in the [Agent Skills overview](/en/docs/agents-and-tools/agent-skills/overview).

<Note>
  For a deep dive into the architecture and real-world applications of Agent Skills, read our engineering blog: [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills).
</Note>

## Create a Skill

Skills are stored as directories containing a `SKILL.md` file.

### Personal Skills

Personal Skills are available across all your projects. Store them in `~/.claude/skills/`:

```bash  theme={null}
mkdir -p ~/.claude/skills/my-skill-name
```

**Use personal Skills for**:

* Your individual workflows and preferences
* Experimental Skills you're developing
* Personal productivity tools

### Project Skills

Project Skills are shared with your team. Store them in `.claude/skills/` within your project:

```bash  theme={null}
mkdir -p .claude/skills/my-skill-name
```

**Use project Skills for**:

* Team workflows and conventions
* Project-specific expertise
* Shared utilities and scripts

Project Skills are checked into git and automatically available to team members.

### Plugin Skills

Skills can also come from [Claude Code plugins](/en/docs/claude-code/plugins). Plugins may bundle Skills that are automatically available when the plugin is installed. These Skills work the same way as personal and project Skills.

## Write SKILL.md

Create a `SKILL.md` file with YAML frontmatter and Markdown content:

```yaml  theme={null}
---
name: your-skill-name
description: Brief description of what this Skill does and when to use it
---

# Your Skill Name

## Instructions
Provide clear, step-by-step guidance for Claude.

## Examples
Show concrete examples of using this Skill.
```

**Field requirements**:

* `name`: Must use lowercase letters, numbers, and hyphens only (max 64 characters)
* `description`: Brief description of what the Skill does and when to use it (max 1024 characters)

The `description` field is critical for Claude to discover when to use your Skill. It should include both what the Skill does and when Claude should use it.

See the [best practices guide](/en/docs/agents-and-tools/agent-skills/best-practices) for complete authoring guidance including validation rules.

## Add supporting files

Create additional files alongside SKILL.md:

```
my-skill/
├── SKILL.md (required)
├── reference.md (optional documentation)
├── examples.md (optional examples)
├── scripts/
│   └── helper.py (optional utility)
└── templates/
    └── template.txt (optional template)
```

Reference these files from SKILL.md:

````markdown  theme={null}
For advanced usage, see [reference.md](reference.md).

Run the helper script:
```bash
python scripts/helper.py input.txt
```
````

Claude reads these files only when needed, using progressive disclosure to manage context efficiently.

## Restrict tool access with allowed-tools

Use the `allowed-tools` frontmatter field to limit which tools Claude can use when a Skill is active:

```yaml  theme={null}
---
name: safe-file-reader
description: Read files without making changes. Use when you need read-only file access.
allowed-tools: Read, Grep, Glob
---

# Safe File Reader

This Skill provides read-only file access.

## Instructions
1. Use Read to view file contents
2. Use Grep to search within files
3. Use Glob to find files by pattern
```

When this Skill is active, Claude can only use the specified tools (Read, Grep, Glob) without needing to ask for permission. This is useful for:

* Read-only Skills that shouldn't modify files
* Skills with limited scope (e.g., only data analysis, no file writing)
* Security-sensitive workflows where you want to restrict capabilities

If `allowed-tools` is not specified, Claude will ask for permission to use tools as normal, following the standard permission model.

<Note>
  `allowed-tools` is only supported for Skills in Claude Code.
</Note>

## View available Skills

Skills are automatically discovered by Claude from three sources:

* Personal Skills: `~/.claude/skills/`
* Project Skills: `.claude/skills/`
* Plugin Skills: bundled with installed plugins

**To view all available Skills**, ask Claude directly:

```
What Skills are available?
```

or

```
List all available Skills
```

This will show all Skills from all sources, including plugin Skills.

**To inspect a specific Skill**, you can also check the filesystem:

```bash  theme={null}
# List personal Skills
ls ~/.claude/skills/

# List project Skills (if in a project directory)
ls .claude/skills/

# View a specific Skill's content
cat ~/.claude/skills/my-skill/SKILL.md
```

## Test a Skill

After creating a Skill, test it by asking questions that match your description.

**Example**: If your description mentions "PDF files":

```
Can you help me extract text from this PDF?
```

Claude autonomously decides to use your Skill if it matches the request—you don't need to explicitly invoke it. The Skill activates automatically based on the context of your question.

## Debug a Skill

If Claude doesn't use your Skill, check these common issues:

### Make description specific

**Too vague**:

```yaml  theme={null}
description: Helps with documents
```

**Specific**:

```yaml  theme={null}
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF files or when the user mentions PDFs, forms, or document extraction.
```

Include both what the Skill does and when to use it in the description.

### Verify file path

**Personal Skills**: `~/.claude/skills/skill-name/SKILL.md`
**Project Skills**: `.claude/skills/skill-name/SKILL.md`

Check the file exists:

```bash  theme={null}
# Personal
ls ~/.claude/skills/my-skill/SKILL.md

# Project
ls .claude/skills/my-skill/SKILL.md
```

### Check YAML syntax

Invalid YAML prevents the Skill from loading. Verify the frontmatter:

```bash  theme={null}
cat SKILL.md | head -n 10
```

Ensure:

* Opening `---` on line 1
* Closing `---` before Markdown content
* Valid YAML syntax (no tabs, correct indentation)

### View errors

Run Claude Code with debug mode to see Skill loading errors:

```bash  theme={null}
claude --debug
```

## Share Skills with your team

**Recommended approach**: Distribute Skills through [plugins](/en/docs/claude-code/plugins).

To share Skills via plugin:

1. Create a plugin with Skills in the `skills/` directory
2. Add the plugin to a marketplace
3. Team members install the plugin

For complete instructions, see [Add Skills to your plugin](/en/docs/claude-code/plugins#add-skills-to-your-plugin).

You can also share Skills directly through project repositories:

### Step 1: Add Skill to your project

Create a project Skill:

```bash  theme={null}
mkdir -p .claude/skills/team-skill
# Create SKILL.md
```

### Step 2: Commit to git

```bash  theme={null}
git add .claude/skills/
git commit -m "Add team Skill for PDF processing"
git push
```

### Step 3: Team members get Skills automatically

When team members pull the latest changes, Skills are immediately available:

```bash  theme={null}
git pull
claude  # Skills are now available
```

## Update a Skill

Edit SKILL.md directly:

```bash  theme={null}
# Personal Skill
code ~/.claude/skills/my-skill/SKILL.md

# Project Skill
code .claude/skills/my-skill/SKILL.md
```

Changes take effect the next time you start Claude Code. If Claude Code is already running, restart it to load the updates.

## Remove a Skill

Delete the Skill directory:

```bash  theme={null}
# Personal
rm -rf ~/.claude/skills/my-skill

# Project
rm -rf .claude/skills/my-skill
git commit -m "Remove unused Skill"
```

## Best practices

### Keep Skills focused

One Skill should address one capability:

**Focused**:

* "PDF form filling"
* "Excel data analysis"
* "Git commit messages"

**Too broad**:

* "Document processing" (split into separate Skills)
* "Data tools" (split by data type or operation)

### Write clear descriptions

Help Claude discover when to use Skills by including specific triggers in your description:

**Clear**:

```yaml  theme={null}
description: Analyze Excel spreadsheets, create pivot tables, and generate charts. Use when working with Excel files, spreadsheets, or analyzing tabular data in .xlsx format.
```

**Vague**:

```yaml  theme={null}
description: For files
```

### Test with your team

Have teammates use Skills and provide feedback:

* Does the Skill activate when expected?
* Are the instructions clear?
* Are there missing examples or edge cases?

### Document Skill versions

You can document Skill versions in your SKILL.md content to track changes over time. Add a version history section:

```markdown  theme={null}
# My Skill

## Version History
- v2.0.0 (2025-10-01): Breaking changes to API
- v1.1.0 (2025-09-15): Added new features
- v1.0.0 (2025-09-01): Initial release
```

This helps team members understand what changed between versions.

## Troubleshooting

### Claude doesn't use my Skill

**Symptom**: You ask a relevant question but Claude doesn't use your Skill.

**Check**: Is the description specific enough?

Vague descriptions make discovery difficult. Include both what the Skill does and when to use it, with key terms users would mention.

**Too generic**:

```yaml  theme={null}
description: Helps with data
```

**Specific**:

```yaml  theme={null}
description: Analyze Excel spreadsheets, generate pivot tables, create charts. Use when working with Excel files, spreadsheets, or .xlsx files.
```

**Check**: Is the YAML valid?

Run validation to check for syntax errors:

```bash  theme={null}
# View frontmatter
cat .claude/skills/my-skill/SKILL.md | head -n 15

# Check for common issues
# - Missing opening or closing ---
# - Tabs instead of spaces
# - Unquoted strings with special characters
```

**Check**: Is the Skill in the correct location?

```bash  theme={null}
# Personal Skills
ls ~/.claude/skills/*/SKILL.md

# Project Skills
ls .claude/skills/*/SKILL.md
```

### Skill has errors

**Symptom**: The Skill loads but doesn't work correctly.

**Check**: Are dependencies available?

Claude will automatically install required dependencies (or ask for permission to install them) when it needs them.

**Check**: Do scripts have execute permissions?

```bash  theme={null}
chmod +x .claude/skills/my-skill/scripts/*.py
```

**Check**: Are file paths correct?

Use forward slashes (Unix style) in all paths:

**Correct**: `scripts/helper.py`
**Wrong**: `scripts\helper.py` (Windows style)

### Multiple Skills conflict

**Symptom**: Claude uses the wrong Skill or seems confused between similar Skills.

**Be specific in descriptions**: Help Claude choose the right Skill by using distinct trigger terms in your descriptions.

Instead of:

```yaml  theme={null}
# Skill 1
description: For data analysis

# Skill 2
description: For analyzing data
```

Use:

```yaml  theme={null}
# Skill 1
description: Analyze sales data in Excel files and CRM exports. Use for sales reports, pipeline analysis, and revenue tracking.

# Skill 2
description: Analyze log files and system metrics data. Use for performance monitoring, debugging, and system diagnostics.
```

## Examples

### Simple Skill (single file)

```
commit-helper/
└── SKILL.md
```

```yaml  theme={null}
---
name: generating-commit-messages
description: Generates clear commit messages from git diffs. Use when writing commit messages or reviewing staged changes.
---

# Generating Commit Messages

## Instructions

1. Run `git diff --staged` to see changes
2. I'll suggest a commit message with:
   - Summary under 50 characters
   - Detailed description
   - Affected components

## Best practices

- Use present tense
- Explain what and why, not how
```

### Skill with tool permissions

```
code-reviewer/
└── SKILL.md
```

```yaml  theme={null}
---
name: code-reviewer
description: Review code for best practices and potential issues. Use when reviewing code, checking PRs, or analyzing code quality.
allowed-tools: Read, Grep, Glob
---

# Code Reviewer

## Review checklist

1. Code organization and structure
2. Error handling
3. Performance considerations
4. Security concerns
5. Test coverage

## Instructions

1. Read the target files using Read tool
2. Search for patterns using Grep
3. Find related files using Glob
4. Provide detailed feedback on code quality
```

### Multi-file Skill

```
pdf-processing/
├── SKILL.md
├── FORMS.md
├── REFERENCE.md
└── scripts/
    ├── fill_form.py
    └── validate.py
```

**SKILL.md**:

````yaml  theme={null}
---
name: pdf-processing
description: Extract text, fill forms, merge PDFs. Use when working with PDF files, forms, or document extraction. Requires pypdf and pdfplumber packages.
---

# PDF Processing

## Quick start

Extract text:
```python
import pdfplumber
with pdfplumber.open("doc.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

For form filling, see [FORMS.md](FORMS.md).
For detailed API reference, see [REFERENCE.md](REFERENCE.md).

## Requirements

Packages must be installed in your environment:
```bash
pip install pypdf pdfplumber
```
````

<Note>
  List required packages in the description. Packages must be installed in your environment before Claude can use them.
</Note>

Claude loads additional files only when needed.

## Next steps

<CardGroup cols={2}>
  <Card title="Authoring best practices" icon="lightbulb" href="/en/docs/agents-and-tools/agent-skills/best-practices">
    Write Skills that Claude can use effectively
  </Card>

  <Card title="Agent Skills overview" icon="book" href="/en/docs/agents-and-tools/agent-skills/overview">
    Learn how Skills work across Claude products
  </Card>

  <Card title="Use Skills in the Agent SDK" icon="cube" href="/en/api/agent-sdk/skills">
    Use Skills programmatically with TypeScript and Python
  </Card>

  <Card title="Get started with Agent Skills" icon="rocket" href="/en/docs/agents-and-tools/agent-skills/quickstart">
    Create your first Skill
  </Card>
</CardGroup>

# Slash commands

> Control Claude's behavior during an interactive session with slash commands.

## Built-in slash commands

| Command                   | Purpose                                                                                                                                      |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `/add-dir`                | Add additional working directories                                                                                                           |
| `/agents`                 | Manage custom AI subagents for specialized tasks                                                                                             |
| `/bug`                    | Report bugs (sends conversation to Anthropic)                                                                                                |
| `/clear`                  | Clear conversation history                                                                                                                   |
| `/compact [instructions]` | Compact conversation with optional focus instructions                                                                                        |
| `/config`                 | Open the Settings interface (Config tab)                                                                                                     |
| `/cost`                   | Show token usage statistics (see [cost tracking guide](/en/docs/claude-code/costs#using-the-cost-command) for subscription-specific details) |
| `/doctor`                 | Checks the health of your Claude Code installation                                                                                           |
| `/help`                   | Get usage help                                                                                                                               |
| `/init`                   | Initialize project with CLAUDE.md guide                                                                                                      |
| `/login`                  | Switch Anthropic accounts                                                                                                                    |
| `/logout`                 | Sign out from your Anthropic account                                                                                                         |
| `/mcp`                    | Manage MCP server connections and OAuth authentication                                                                                       |
| `/memory`                 | Edit CLAUDE.md memory files                                                                                                                  |
| `/model`                  | Select or change the AI model                                                                                                                |
| `/permissions`            | View or update [permissions](/en/docs/claude-code/iam#configuring-permissions)                                                               |
| `/pr_comments`            | View pull request comments                                                                                                                   |
| `/review`                 | Request code review                                                                                                                          |
| `/sandbox`                | Enable sandboxed bash tool with filesystem and network isolation for safer, more autonomous execution                                        |
| `/rewind`                 | Rewind the conversation and/or code                                                                                                          |
| `/status`                 | Open the Settings interface (Status tab) showing version, model, account, and connectivity                                                   |
| `/terminal-setup`         | Install Shift+Enter key binding for newlines (iTerm2 and VSCode only)                                                                        |
| `/usage`                  | Show plan usage limits and rate limit status (subscription plans only)                                                                       |
| `/vim`                    | Enter vim mode for alternating insert and command modes                                                                                      |

## Custom slash commands

Custom slash commands allow you to define frequently-used prompts as Markdown files that Claude Code can execute. Commands are organized by scope (project-specific or personal) and support namespacing through directory structures.

### Syntax

```
/<command-name> [arguments]
```

#### Parameters

| Parameter        | Description                                                       |
| :--------------- | :---------------------------------------------------------------- |
| `<command-name>` | Name derived from the Markdown filename (without `.md` extension) |
| `[arguments]`    | Optional arguments passed to the command                          |

### Command types

#### Project commands

Commands stored in your repository and shared with your team. When listed in `/help`, these commands show "(project)" after their description.

**Location**: `.claude/commands/`

In the following example, we create the `/optimize` command:

```bash  theme={null}
# Create a project command
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

#### Personal commands

Commands available across all your projects. When listed in `/help`, these commands show "(user)" after their description.

**Location**: `~/.claude/commands/`

In the following example, we create the `/security-review` command:

```bash  theme={null}
# Create a personal command
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
```

### Features

#### Namespacing

Organize commands in subdirectories. The subdirectories are used for organization and appear in the command description, but they do not affect the command name itself. The description will show whether the command comes from the project directory (`.claude/commands`) or the user-level directory (`~/.claude/commands`), along with the subdirectory name.

Conflicts between user and project level commands are not supported. Otherwise, multiple commands with the same base file name can coexist.

For example, a file at `.claude/commands/frontend/component.md` creates the command `/component` with description showing "(project:frontend)".
Meanwhile, a file at `~/.claude/commands/component.md` creates the command `/component` with description showing "(user)".

#### Arguments

Pass dynamic values to commands using argument placeholders:

##### All arguments with `$ARGUMENTS`

The `$ARGUMENTS` placeholder captures all arguments passed to the command:

```bash  theme={null}
# Command definition
echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md

# Usage
> /fix-issue 123 high-priority
# $ARGUMENTS becomes: "123 high-priority"
```

##### Individual arguments with `$1`, `$2`, etc.

Access specific arguments individually using positional parameters (similar to shell scripts):

```bash  theme={null}
# Command definition  
echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md

# Usage
> /review-pr 456 high alice
# $1 becomes "456", $2 becomes "high", $3 becomes "alice"
```

Use positional arguments when you need to:

* Access arguments individually in different parts of your command
* Provide defaults for missing arguments
* Build more structured commands with specific parameter roles

#### Bash command execution

Execute bash commands before the slash command runs using the `!` prefix. The output is included in the command context. You *must* include `allowed-tools` with the `Bash` tool, but you can choose the specific bash commands to allow.

For example:

```markdown  theme={null}
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

#### File references

Include file contents in commands using the `@` prefix to [reference files](/en/docs/claude-code/common-workflows#reference-files-and-directories).

For example:

```markdown  theme={null}
# Reference a specific file

Review the implementation in @src/utils/helpers.js

# Reference multiple files

Compare @src/old-version.js with @src/new-version.js
```

#### Thinking mode

Slash commands can trigger extended thinking by including [extended thinking keywords](/en/docs/claude-code/common-workflows#use-extended-thinking).

### Frontmatter

Command files support frontmatter, useful for specifying metadata about the command:

| Frontmatter                | Purpose                                                                                                                                                                               | Default                             |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------- |
| `allowed-tools`            | List of tools the command can use                                                                                                                                                     | Inherits from the conversation      |
| `argument-hint`            | The arguments expected for the slash command. Example: `argument-hint: add [tagId] \| remove [tagId] \| list`. This hint is shown to the user when auto-completing the slash command. | None                                |
| `description`              | Brief description of the command                                                                                                                                                      | Uses the first line from the prompt |
| `model`                    | Specific model string (see [Models overview](/en/docs/about-claude/models/overview))                                                                                                  | Inherits from the conversation      |
| `disable-model-invocation` | Whether to prevent `SlashCommand` tool from calling this command                                                                                                                      | false                               |

For example:

```markdown  theme={null}
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit
model: claude-3-5-haiku-20241022
---

Create a git commit with message: $ARGUMENTS
```

Example using positional arguments:

```markdown  theme={null}
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

## Plugin commands

[Plugins](/en/docs/claude-code/plugins) can provide custom slash commands that integrate seamlessly with Claude Code. Plugin commands work exactly like user-defined commands but are distributed through [plugin marketplaces](/en/docs/claude-code/plugin-marketplaces).

### How plugin commands work

Plugin commands are:

* **Namespaced**: Commands can use the format `/plugin-name:command-name` to avoid conflicts (plugin prefix is optional unless there are name collisions)
* **Automatically available**: Once a plugin is installed and enabled, its commands appear in `/help`
* **Fully integrated**: Support all command features (arguments, frontmatter, bash execution, file references)

### Plugin command structure

**Location**: `commands/` directory in plugin root

**File format**: Markdown files with frontmatter

**Basic command structure**:

```markdown  theme={null}
---
description: Brief description of what the command does
---

# Command Name

Detailed instructions for Claude on how to execute this command.
Include specific guidance on parameters, expected outcomes, and any special considerations.
```

**Advanced command features**:

* **Arguments**: Use placeholders like `{arg1}` in command descriptions
* **Subdirectories**: Organize commands in subdirectories for namespacing
* **Bash integration**: Commands can execute shell scripts and programs
* **File references**: Commands can reference and modify project files

### Invocation patterns

```shell Direct command (when no conflicts) theme={null}
/command-name
```

```shell Plugin-prefixed (when needed for disambiguation) theme={null}
/plugin-name:command-name
```

```shell With arguments (if command supports them) theme={null}
/command-name arg1 arg2
```

## MCP slash commands

MCP servers can expose prompts as slash commands that become available in Claude Code. These commands are dynamically discovered from connected MCP servers.

### Command format

MCP commands follow the pattern:

```
/mcp__<server-name>__<prompt-name> [arguments]
```

### Features

#### Dynamic discovery

MCP commands are automatically available when:

* An MCP server is connected and active
* The server exposes prompts through the MCP protocol
* The prompts are successfully retrieved during connection

#### Arguments

MCP prompts can accept arguments defined by the server:

```
# Without arguments
> /mcp__github__list_prs

# With arguments
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Bug title" high
```

#### Naming conventions

* Server and prompt names are normalized
* Spaces and special characters become underscores
* Names are lowercased for consistency

### Managing MCP connections

Use the `/mcp` command to:

* View all configured MCP servers
* Check connection status
* Authenticate with OAuth-enabled servers
* Clear authentication tokens
* View available tools and prompts from each server

### MCP permissions and wildcards

When configuring [permissions for MCP tools](/en/docs/claude-code/iam#tool-specific-permission-rules), note that **wildcards are not supported**:

* ✅ **Correct**: `mcp__github` (approves ALL tools from the github server)
* ✅ **Correct**: `mcp__github__get_issue` (approves specific tool)
* ❌ **Incorrect**: `mcp__github__*` (wildcards not supported)

To approve all tools from an MCP server, use just the server name: `mcp__servername`. To approve specific tools only, list each tool individually.

## `SlashCommand` tool

The `SlashCommand` tool allows Claude to execute [custom slash commands](/en/docs/claude-code/slash-commands#custom-slash-commands) programmatically
during a conversation. This gives Claude the ability to invoke custom commands
on your behalf when appropriate.

To encourage Claude to trigger `SlashCommand` tool, your instructions (prompts,
CLAUDE.md, etc.) generally need to reference the command by name with its slash.

Example:

```
> Run /write-unit-test when you are about to start writing tests.
```

This tool puts each available custom slash command's metadata into context up to the
character budget limit. You can use `/context` to monitor token usage and follow
the operations below to manage context.

### `SlashCommand` tool supported commands

`SlashCommand` tool only supports custom slash commands that:

* Are user-defined. Built-in commands like `/compact` and `/init` are *not* supported.
* Have the `description` frontmatter field populated. We use the `description` in the context.

For Claude Code versions >= 1.0.124, you can see which custom slash commands
`SlashCommand` tool can invoke by running `claude --debug` and triggering a query.

### Disable `SlashCommand` tool

To prevent Claude from executing any slash commands via the tool:

```bash  theme={null}
/permissions
# Add to deny rules: SlashCommand
```

This will also remove SlashCommand tool (and the slash command descriptions) from context.

### Disable specific commands only

To prevent a specific slash command from becoming available, add
`disable-model-invocation: true` to the slash command's frontmatter.

This will also remove the command's metadata from context.

### `SlashCommand` permission rules

The permission rules support:

* **Exact match**: `SlashCommand:/commit` (allows only `/commit` with no arguments)
* **Prefix match**: `SlashCommand:/review-pr:*` (allows `/review-pr` with any arguments)

### Character budget limit

The `SlashCommand` tool includes a character budget to limit the size of command
descriptions shown to Claude. This prevents token overflow when many commands
are available.

The budget includes each custom slash command's name, args, and description.

* **Default limit**: 15,000 characters
* **Custom limit**: Set via `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable

When the character budget is exceeded, Claude will see only a subset of the
available commands. In `/context`, a warning will show with "M of N commands".

## Skills vs slash commands

**Slash commands** and **Agent Skills** serve different purposes in Claude Code:

### Use slash commands for

**Quick, frequently-used prompts**:

* Simple prompt snippets you use often
* Quick reminders or templates
* Frequently-used instructions that fit in one file

**Examples**:

* `/review` → "Review this code for bugs and suggest improvements"
* `/explain` → "Explain this code in simple terms"
* `/optimize` → "Analyze this code for performance issues"

### Use Skills for

**Comprehensive capabilities with structure**:

* Complex workflows with multiple steps
* Capabilities requiring scripts or utilities
* Knowledge organized across multiple files
* Team workflows you want to standardize

**Examples**:

* PDF processing Skill with form-filling scripts and validation
* Data analysis Skill with reference docs for different data types
* Documentation Skill with style guides and templates

### Key differences

| Aspect         | Slash Commands                   | Agent Skills                        |
| -------------- | -------------------------------- | ----------------------------------- |
| **Complexity** | Simple prompts                   | Complex capabilities                |
| **Structure**  | Single .md file                  | Directory with SKILL.md + resources |
| **Discovery**  | Explicit invocation (`/command`) | Automatic (based on context)        |
| **Files**      | One file only                    | Multiple files, scripts, templates  |
| **Scope**      | Project or personal              | Project or personal                 |
| **Sharing**    | Via git                          | Via git                             |

### Example comparison

**As a slash command**:

```markdown  theme={null}
# .claude/commands/review.md
Review this code for:
- Security vulnerabilities
- Performance issues
- Code style violations
```

Usage: `/review` (manual invocation)

**As a Skill**:

```
.claude/skills/code-review/
├── SKILL.md (overview and workflows)
├── SECURITY.md (security checklist)
├── PERFORMANCE.md (performance patterns)
├── STYLE.md (style guide reference)
└── scripts/
    └── run-linters.sh
```

Usage: "Can you review this code?" (automatic discovery)

The Skill provides richer context, validation scripts, and organized reference material.

### When to use each

**Use slash commands**:

* You invoke the same prompt repeatedly
* The prompt fits in a single file
* You want explicit control over when it runs

**Use Skills**:

* Claude should discover the capability automatically
* Multiple files or scripts are needed
* Complex workflows with validation steps
* Team needs standardized, detailed guidance

Both slash commands and Skills can coexist. Use the approach that fits your needs.

Learn more about [Agent Skills](/en/docs/claude-code/skills).

## See also

* [Plugins](/en/docs/claude-code/plugins) - Extend Claude Code with custom commands through plugins
* [Identity and Access Management](/en/docs/claude-code/iam) - Complete guide to permissions, including MCP tool permissions
* [Interactive mode](/en/docs/claude-code/interactive-mode) - Shortcuts, input modes, and interactive features
* [CLI reference](/en/docs/claude-code/cli-reference) - Command-line flags and options
* [Settings](/en/docs/claude-code/settings) - Configuration options
* [Memory management](/en/docs/claude-code/memory) - Managing Claude's memory across sessions

# Slash commands

> Control Claude's behavior during an interactive session with slash commands.

## Built-in slash commands

| Command                   | Purpose                                                                                                                                      |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `/add-dir`                | Add additional working directories                                                                                                           |
| `/agents`                 | Manage custom AI subagents for specialized tasks                                                                                             |
| `/bug`                    | Report bugs (sends conversation to Anthropic)                                                                                                |
| `/clear`                  | Clear conversation history                                                                                                                   |
| `/compact [instructions]` | Compact conversation with optional focus instructions                                                                                        |
| `/config`                 | Open the Settings interface (Config tab)                                                                                                     |
| `/cost`                   | Show token usage statistics (see [cost tracking guide](/en/docs/claude-code/costs#using-the-cost-command) for subscription-specific details) |
| `/doctor`                 | Checks the health of your Claude Code installation                                                                                           |
| `/help`                   | Get usage help                                                                                                                               |
| `/init`                   | Initialize project with CLAUDE.md guide                                                                                                      |
| `/login`                  | Switch Anthropic accounts                                                                                                                    |
| `/logout`                 | Sign out from your Anthropic account                                                                                                         |
| `/mcp`                    | Manage MCP server connections and OAuth authentication                                                                                       |
| `/memory`                 | Edit CLAUDE.md memory files                                                                                                                  |
| `/model`                  | Select or change the AI model                                                                                                                |
| `/permissions`            | View or update [permissions](/en/docs/claude-code/iam#configuring-permissions)                                                               |
| `/pr_comments`            | View pull request comments                                                                                                                   |
| `/review`                 | Request code review                                                                                                                          |
| `/sandbox`                | Enable sandboxed bash tool with filesystem and network isolation for safer, more autonomous execution                                        |
| `/rewind`                 | Rewind the conversation and/or code                                                                                                          |
| `/status`                 | Open the Settings interface (Status tab) showing version, model, account, and connectivity                                                   |
| `/terminal-setup`         | Install Shift+Enter key binding for newlines (iTerm2 and VSCode only)                                                                        |
| `/usage`                  | Show plan usage limits and rate limit status (subscription plans only)                                                                       |
| `/vim`                    | Enter vim mode for alternating insert and command modes                                                                                      |

## Custom slash commands

Custom slash commands allow you to define frequently-used prompts as Markdown files that Claude Code can execute. Commands are organized by scope (project-specific or personal) and support namespacing through directory structures.

### Syntax

```
/<command-name> [arguments]
```

#### Parameters

| Parameter        | Description                                                       |
| :--------------- | :---------------------------------------------------------------- |
| `<command-name>` | Name derived from the Markdown filename (without `.md` extension) |
| `[arguments]`    | Optional arguments passed to the command                          |

### Command types

#### Project commands

Commands stored in your repository and shared with your team. When listed in `/help`, these commands show "(project)" after their description.

**Location**: `.claude/commands/`

In the following example, we create the `/optimize` command:

```bash  theme={null}
# Create a project command
mkdir -p .claude/commands
echo "Analyze this code for performance issues and suggest optimizations:" > .claude/commands/optimize.md
```

#### Personal commands

Commands available across all your projects. When listed in `/help`, these commands show "(user)" after their description.

**Location**: `~/.claude/commands/`

In the following example, we create the `/security-review` command:

```bash  theme={null}
# Create a personal command
mkdir -p ~/.claude/commands
echo "Review this code for security vulnerabilities:" > ~/.claude/commands/security-review.md
```

### Features

#### Namespacing

Organize commands in subdirectories. The subdirectories are used for organization and appear in the command description, but they do not affect the command name itself. The description will show whether the command comes from the project directory (`.claude/commands`) or the user-level directory (`~/.claude/commands`), along with the subdirectory name.

Conflicts between user and project level commands are not supported. Otherwise, multiple commands with the same base file name can coexist.

For example, a file at `.claude/commands/frontend/component.md` creates the command `/component` with description showing "(project:frontend)".
Meanwhile, a file at `~/.claude/commands/component.md` creates the command `/component` with description showing "(user)".

#### Arguments

Pass dynamic values to commands using argument placeholders:

##### All arguments with `$ARGUMENTS`

The `$ARGUMENTS` placeholder captures all arguments passed to the command:

```bash  theme={null}
# Command definition
echo 'Fix issue #$ARGUMENTS following our coding standards' > .claude/commands/fix-issue.md

# Usage
> /fix-issue 123 high-priority
# $ARGUMENTS becomes: "123 high-priority"
```

##### Individual arguments with `$1`, `$2`, etc.

Access specific arguments individually using positional parameters (similar to shell scripts):

```bash  theme={null}
# Command definition  
echo 'Review PR #$1 with priority $2 and assign to $3' > .claude/commands/review-pr.md

# Usage
> /review-pr 456 high alice
# $1 becomes "456", $2 becomes "high", $3 becomes "alice"
```

Use positional arguments when you need to:

* Access arguments individually in different parts of your command
* Provide defaults for missing arguments
* Build more structured commands with specific parameter roles

#### Bash command execution

Execute bash commands before the slash command runs using the `!` prefix. The output is included in the command context. You *must* include `allowed-tools` with the `Bash` tool, but you can choose the specific bash commands to allow.

For example:

```markdown  theme={null}
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

#### File references

Include file contents in commands using the `@` prefix to [reference files](/en/docs/claude-code/common-workflows#reference-files-and-directories).

For example:

```markdown  theme={null}
# Reference a specific file

Review the implementation in @src/utils/helpers.js

# Reference multiple files

Compare @src/old-version.js with @src/new-version.js
```

#### Thinking mode

Slash commands can trigger extended thinking by including [extended thinking keywords](/en/docs/claude-code/common-workflows#use-extended-thinking).

### Frontmatter

Command files support frontmatter, useful for specifying metadata about the command:

| Frontmatter                | Purpose                                                                                                                                                                               | Default                             |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------- |
| `allowed-tools`            | List of tools the command can use                                                                                                                                                     | Inherits from the conversation      |
| `argument-hint`            | The arguments expected for the slash command. Example: `argument-hint: add [tagId] \| remove [tagId] \| list`. This hint is shown to the user when auto-completing the slash command. | None                                |
| `description`              | Brief description of the command                                                                                                                                                      | Uses the first line from the prompt |
| `model`                    | Specific model string (see [Models overview](/en/docs/about-claude/models/overview))                                                                                                  | Inherits from the conversation      |
| `disable-model-invocation` | Whether to prevent `SlashCommand` tool from calling this command                                                                                                                      | false                               |

For example:

```markdown  theme={null}
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
argument-hint: [message]
description: Create a git commit
model: claude-3-5-haiku-20241022
---

Create a git commit with message: $ARGUMENTS
```

Example using positional arguments:

```markdown  theme={null}
---
argument-hint: [pr-number] [priority] [assignee]
description: Review pull request
---

Review PR #$1 with priority $2 and assign to $3.
Focus on security, performance, and code style.
```

## Plugin commands

[Plugins](/en/docs/claude-code/plugins) can provide custom slash commands that integrate seamlessly with Claude Code. Plugin commands work exactly like user-defined commands but are distributed through [plugin marketplaces](/en/docs/claude-code/plugin-marketplaces).

### How plugin commands work

Plugin commands are:

* **Namespaced**: Commands can use the format `/plugin-name:command-name` to avoid conflicts (plugin prefix is optional unless there are name collisions)
* **Automatically available**: Once a plugin is installed and enabled, its commands appear in `/help`
* **Fully integrated**: Support all command features (arguments, frontmatter, bash execution, file references)

### Plugin command structure

**Location**: `commands/` directory in plugin root

**File format**: Markdown files with frontmatter

**Basic command structure**:

```markdown  theme={null}
---
description: Brief description of what the command does
---

# Command Name

Detailed instructions for Claude on how to execute this command.
Include specific guidance on parameters, expected outcomes, and any special considerations.
```

**Advanced command features**:

* **Arguments**: Use placeholders like `{arg1}` in command descriptions
* **Subdirectories**: Organize commands in subdirectories for namespacing
* **Bash integration**: Commands can execute shell scripts and programs
* **File references**: Commands can reference and modify project files

### Invocation patterns

```shell Direct command (when no conflicts) theme={null}
/command-name
```

```shell Plugin-prefixed (when needed for disambiguation) theme={null}
/plugin-name:command-name
```

```shell With arguments (if command supports them) theme={null}
/command-name arg1 arg2
```

## MCP slash commands

MCP servers can expose prompts as slash commands that become available in Claude Code. These commands are dynamically discovered from connected MCP servers.

### Command format

MCP commands follow the pattern:

```
/mcp__<server-name>__<prompt-name> [arguments]
```

### Features

#### Dynamic discovery

MCP commands are automatically available when:

* An MCP server is connected and active
* The server exposes prompts through the MCP protocol
* The prompts are successfully retrieved during connection

#### Arguments

MCP prompts can accept arguments defined by the server:

```
# Without arguments
> /mcp__github__list_prs

# With arguments
> /mcp__github__pr_review 456
> /mcp__jira__create_issue "Bug title" high
```

#### Naming conventions

* Server and prompt names are normalized
* Spaces and special characters become underscores
* Names are lowercased for consistency

### Managing MCP connections

Use the `/mcp` command to:

* View all configured MCP servers
* Check connection status
* Authenticate with OAuth-enabled servers
* Clear authentication tokens
* View available tools and prompts from each server

### MCP permissions and wildcards

When configuring [permissions for MCP tools](/en/docs/claude-code/iam#tool-specific-permission-rules), note that **wildcards are not supported**:

* ✅ **Correct**: `mcp__github` (approves ALL tools from the github server)
* ✅ **Correct**: `mcp__github__get_issue` (approves specific tool)
* ❌ **Incorrect**: `mcp__github__*` (wildcards not supported)

To approve all tools from an MCP server, use just the server name: `mcp__servername`. To approve specific tools only, list each tool individually.

## `SlashCommand` tool

The `SlashCommand` tool allows Claude to execute [custom slash commands](/en/docs/claude-code/slash-commands#custom-slash-commands) programmatically
during a conversation. This gives Claude the ability to invoke custom commands
on your behalf when appropriate.

To encourage Claude to trigger `SlashCommand` tool, your instructions (prompts,
CLAUDE.md, etc.) generally need to reference the command by name with its slash.

Example:

```
> Run /write-unit-test when you are about to start writing tests.
```

This tool puts each available custom slash command's metadata into context up to the
character budget limit. You can use `/context` to monitor token usage and follow
the operations below to manage context.

### `SlashCommand` tool supported commands

`SlashCommand` tool only supports custom slash commands that:

* Are user-defined. Built-in commands like `/compact` and `/init` are *not* supported.
* Have the `description` frontmatter field populated. We use the `description` in the context.

For Claude Code versions >= 1.0.124, you can see which custom slash commands
`SlashCommand` tool can invoke by running `claude --debug` and triggering a query.

### Disable `SlashCommand` tool

To prevent Claude from executing any slash commands via the tool:

```bash  theme={null}
/permissions
# Add to deny rules: SlashCommand
```

This will also remove SlashCommand tool (and the slash command descriptions) from context.

### Disable specific commands only

To prevent a specific slash command from becoming available, add
`disable-model-invocation: true` to the slash command's frontmatter.

This will also remove the command's metadata from context.

### `SlashCommand` permission rules

The permission rules support:

* **Exact match**: `SlashCommand:/commit` (allows only `/commit` with no arguments)
* **Prefix match**: `SlashCommand:/review-pr:*` (allows `/review-pr` with any arguments)

### Character budget limit

The `SlashCommand` tool includes a character budget to limit the size of command
descriptions shown to Claude. This prevents token overflow when many commands
are available.

The budget includes each custom slash command's name, args, and description.

* **Default limit**: 15,000 characters
* **Custom limit**: Set via `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable

When the character budget is exceeded, Claude will see only a subset of the
available commands. In `/context`, a warning will show with "M of N commands".

## Skills vs slash commands

**Slash commands** and **Agent Skills** serve different purposes in Claude Code:

### Use slash commands for

**Quick, frequently-used prompts**:

* Simple prompt snippets you use often
* Quick reminders or templates
* Frequently-used instructions that fit in one file

**Examples**:

* `/review` → "Review this code for bugs and suggest improvements"
* `/explain` → "Explain this code in simple terms"
* `/optimize` → "Analyze this code for performance issues"

### Use Skills for

**Comprehensive capabilities with structure**:

* Complex workflows with multiple steps
* Capabilities requiring scripts or utilities
* Knowledge organized across multiple files
* Team workflows you want to standardize

**Examples**:

* PDF processing Skill with form-filling scripts and validation
* Data analysis Skill with reference docs for different data types
* Documentation Skill with style guides and templates

### Key differences

| Aspect         | Slash Commands                   | Agent Skills                        |
| -------------- | -------------------------------- | ----------------------------------- |
| **Complexity** | Simple prompts                   | Complex capabilities                |
| **Structure**  | Single .md file                  | Directory with SKILL.md + resources |
| **Discovery**  | Explicit invocation (`/command`) | Automatic (based on context)        |
| **Files**      | One file only                    | Multiple files, scripts, templates  |
| **Scope**      | Project or personal              | Project or personal                 |
| **Sharing**    | Via git                          | Via git                             |

### Example comparison

**As a slash command**:

```markdown  theme={null}
# .claude/commands/review.md
Review this code for:
- Security vulnerabilities
- Performance issues
- Code style violations
```

Usage: `/review` (manual invocation)

**As a Skill**:

```
.claude/skills/code-review/
├── SKILL.md (overview and workflows)
├── SECURITY.md (security checklist)
├── PERFORMANCE.md (performance patterns)
├── STYLE.md (style guide reference)
└── scripts/
    └── run-linters.sh
```

Usage: "Can you review this code?" (automatic discovery)

The Skill provides richer context, validation scripts, and organized reference material.

### When to use each

**Use slash commands**:

* You invoke the same prompt repeatedly
* The prompt fits in a single file
* You want explicit control over when it runs

**Use Skills**:

* Claude should discover the capability automatically
* Multiple files or scripts are needed
* Complex workflows with validation steps
* Team needs standardized, detailed guidance

Both slash commands and Skills can coexist. Use the approach that fits your needs.

Learn more about [Agent Skills](/en/docs/claude-code/skills).

## See also

* [Plugins](/en/docs/claude-code/plugins) - Extend Claude Code with custom commands through plugins
* [Identity and Access Management](/en/docs/claude-code/iam) - Complete guide to permissions, including MCP tool permissions
* [Interactive mode](/en/docs/claude-code/interactive-mode) - Shortcuts, input modes, and interactive features
* [CLI reference](/en/docs/claude-code/cli-reference) - Command-line flags and options
* [Settings](/en/docs/claude-code/settings) - Configuration options
* [Memory management](/en/docs/claude-code/memory) - Managing Claude's memory across sessions

# Claude Code settings

> Configure Claude Code with global and project-level settings, and environment variables.

Claude Code offers a variety of settings to configure its behavior to meet your needs. You can configure Claude Code by running the `/config` command when using the interactive REPL, which opens a tabbed Settings interface where you can view status information and modify configuration options.

## Settings files

The `settings.json` file is our official mechanism for configuring Claude
Code through hierarchical settings:

* **User settings** are defined in `~/.claude/settings.json` and apply to all
  projects.
* **Project settings** are saved in your project directory:
  * `.claude/settings.json` for settings that are checked into source control and shared with your team
  * `.claude/settings.local.json` for settings that are not checked in, useful for personal preferences and experimentation. Claude Code will configure git to ignore `.claude/settings.local.json` when it is created.
* For enterprise deployments of Claude Code, we also support **enterprise
  managed policy settings**. These take precedence over user and project
  settings. System administrators can deploy policies to:
  * macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
  * Linux and WSL: `/etc/claude-code/managed-settings.json`
  * Windows: `C:\ProgramData\ClaudeCode\managed-settings.json`
* Enterprise deployments can also configure **managed MCP servers** that override
  user-configured servers. See [Enterprise MCP configuration](/en/docs/claude-code/mcp#enterprise-mcp-configuration):
  * macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
  * Linux and WSL: `/etc/claude-code/managed-mcp.json`
  * Windows: `C:\ProgramData\ClaudeCode\managed-mcp.json`

```JSON Example settings.json theme={null}
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test:*)",
      "Read(~/.zshrc)"
    ],
    "deny": [
      "Bash(curl:*)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)"
    ]
  },
  "env": {
    "CLAUDE_CODE_ENABLE_TELEMETRY": "1",
    "OTEL_METRICS_EXPORTER": "otlp"
  }
}
```

### Available settings

`settings.json` supports a number of options:

| Key                          | Description                                                                                                                                                                                                                                                                       | Example                                                     |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `apiKeyHelper`               | Custom script, to be executed in `/bin/sh`, to generate an auth value. This value will be sent as `X-Api-Key` and `Authorization: Bearer` headers for model requests                                                                                                              | `/bin/generate_temp_api_key.sh`                             |
| `cleanupPeriodDays`          | How long to locally retain chat transcripts based on last activity date (default: 30 days)                                                                                                                                                                                        | `20`                                                        |
| `env`                        | Environment variables that will be applied to every session                                                                                                                                                                                                                       | `{"FOO": "bar"}`                                            |
| `includeCoAuthoredBy`        | Whether to include the `co-authored-by Claude` byline in git commits and pull requests (default: `true`)                                                                                                                                                                          | `false`                                                     |
| `permissions`                | See table below for structure of permissions.                                                                                                                                                                                                                                     |                                                             |
| `hooks`                      | Configure custom commands to run before or after tool executions. See [hooks documentation](hooks)                                                                                                                                                                                | `{"PreToolUse": {"Bash": "echo 'Running command...'"}}`     |
| `disableAllHooks`            | Disable all [hooks](hooks)                                                                                                                                                                                                                                                        | `true`                                                      |
| `model`                      | Override the default model to use for Claude Code                                                                                                                                                                                                                                 | `"claude-sonnet-4-5-20250929"`                              |
| `statusLine`                 | Configure a custom status line to display context. See [statusLine documentation](statusline)                                                                                                                                                                                     | `{"type": "command", "command": "~/.claude/statusline.sh"}` |
| `outputStyle`                | Configure an output style to adjust the system prompt. See [output styles documentation](output-styles)                                                                                                                                                                           | `"Explanatory"`                                             |
| `forceLoginMethod`           | Use `claudeai` to restrict login to Claude.ai accounts, `console` to restrict login to Claude Console (API usage billing) accounts                                                                                                                                                | `claudeai`                                                  |
| `forceLoginOrgUUID`          | Specify the UUID of an organization to automatically select it during login, bypassing the organization selection step. Requires `forceLoginMethod` to be set                                                                                                                     | `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`                    |
| `enableAllProjectMcpServers` | Automatically approve all MCP servers defined in project `.mcp.json` files                                                                                                                                                                                                        | `true`                                                      |
| `enabledMcpjsonServers`      | List of specific MCP servers from `.mcp.json` files to approve                                                                                                                                                                                                                    | `["memory", "github"]`                                      |
| `disabledMcpjsonServers`     | List of specific MCP servers from `.mcp.json` files to reject                                                                                                                                                                                                                     | `["filesystem"]`                                            |
| `useEnterpriseMcpConfigOnly` | When set in managed-settings.json, restricts MCP servers to only those defined in managed-mcp.json. See [Enterprise MCP configuration](/en/docs/claude-code/mcp#enterprise-mcp-configuration)                                                                                     | `true`                                                      |
| `allowedMcpServers`          | When set in managed-settings.json, allowlist of MCP servers users can configure. Undefined = no restrictions, empty array = lockdown. Applies to all scopes. Denylist takes precedence. See [Enterprise MCP configuration](/en/docs/claude-code/mcp#enterprise-mcp-configuration) | `[{ "serverName": "github" }]`                              |
| `deniedMcpServers`           | When set in managed-settings.json, denylist of MCP servers that are explicitly blocked. Applies to all scopes including enterprise servers. Denylist takes precedence over allowlist. See [Enterprise MCP configuration](/en/docs/claude-code/mcp#enterprise-mcp-configuration)   | `[{ "serverName": "filesystem" }]`                          |
| `awsAuthRefresh`             | Custom script that modifies the `.aws` directory (see [advanced credential configuration](/en/docs/claude-code/amazon-bedrock#advanced-credential-configuration))                                                                                                                 | `aws sso login --profile myprofile`                         |
| `awsCredentialExport`        | Custom script that outputs JSON with AWS credentials (see [advanced credential configuration](/en/docs/claude-code/amazon-bedrock#advanced-credential-configuration))                                                                                                             | `/bin/generate_aws_grant.sh`                                |

### Permission settings

| Keys                           | Description                                                                                                                                                                                                                                                                                                                   | Example                                                                |
| :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `allow`                        | Array of [permission rules](/en/docs/claude-code/iam#configuring-permissions) to allow tool use. **Note:** Bash rules use prefix matching, not regex                                                                                                                                                                          | `[ "Bash(git diff:*)" ]`                                               |
| `ask`                          | Array of [permission rules](/en/docs/claude-code/iam#configuring-permissions) to ask for confirmation upon tool use.                                                                                                                                                                                                          | `[ "Bash(git push:*)" ]`                                               |
| `deny`                         | Array of [permission rules](/en/docs/claude-code/iam#configuring-permissions) to deny tool use. Use this to also exclude sensitive files from Claude Code access. **Note:** Bash patterns are prefix matches and can be bypassed (see [Bash permission limitations](/en/docs/claude-code/iam#tool-specific-permission-rules)) | `[ "WebFetch", "Bash(curl:*)", "Read(./.env)", "Read(./secrets/**)" ]` |
| `additionalDirectories`        | Additional [working directories](iam#working-directories) that Claude has access to                                                                                                                                                                                                                                           | `[ "../docs/" ]`                                                       |
| `defaultMode`                  | Default [permission mode](iam#permission-modes) when opening Claude Code                                                                                                                                                                                                                                                      | `"acceptEdits"`                                                        |
| `disableBypassPermissionsMode` | Set to `"disable"` to prevent `bypassPermissions` mode from being activated. This disables the `--dangerously-skip-permissions` command-line flag. See [managed policy settings](iam#enterprise-managed-policy-settings)                                                                                                      | `"disable"`                                                            |

### Sandbox settings

Configure advanced sandboxing behavior. Sandboxing isolates bash commands from your filesystem and network. See [Sandboxing](/en/docs/claude-code/sandboxing) for details.

**Filesystem and network restrictions** are configured via Read, Edit, and WebFetch permission rules, not via these sandbox settings.

| Keys                        | Description                                                                                                   | Example                   |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------ | :------------------------ |
| `enabled`                   | Enable bash sandboxing (macOS/Linux only). Default: false                                                     | `true`                    |
| `autoAllowBashIfSandboxed`  | Auto-approve bash commands when sandboxed. Default: true                                                      | `true`                    |
| `excludedCommands`          | Commands that should run outside of the sandbox                                                               | `["git", "docker"]`       |
| `network.allowUnixSockets`  | Unix socket paths accessible in sandbox (for SSH agents, etc.)                                                | `["~/.ssh/agent-socket"]` |
| `network.allowLocalBinding` | Allow binding to localhost ports (MacOS only). Default: false                                                 | `true`                    |
| `network.httpProxyPort`     | HTTP proxy port used if you wish to bring your own proxy. If not specified, Claude will run its own proxy.    | `8080`                    |
| `network.socksProxyPort`    | SOCKS5 proxy port used if you wish to bring your own proxy. If not specified, Claude will run its own proxy.  | `8081`                    |
| `enableWeakerNestedSandbox` | Enable weaker sandbox for unprivileged Docker environments (Linux only). **Reduces security.** Default: false | `true`                    |

**Configuration example:**

```json  theme={null}
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true,
    "excludedCommands": ["docker"],
    "network": {
      "allowUnixSockets": [
        "/var/run/docker.sock"
      ],
      "allowLocalBinding": true
    }
  },
  "permissions": {
    "deny": [
      "Read(.envrc)",
      "Read(~/.aws/**)"
    ]
  }
}
```

**Filesystem access** is controlled via Read/Edit permissions:

* Read deny rules block file reads in sandbox
* Edit allow rules permit file writes (in addition to the defaults, e.g. the current working directory)
* Edit deny rules block writes within allowed paths

**Network access** is controlled via WebFetch permissions:

* WebFetch allow rules permit network domains
* WebFetch deny rules block network domains

### Settings precedence

Settings are applied in order of precedence (highest to lowest):

1. **Enterprise managed policies** (`managed-settings.json`)
   * Deployed by IT/DevOps
   * Cannot be overridden

2. **Command line arguments**
   * Temporary overrides for a specific session

3. **Local project settings** (`.claude/settings.local.json`)
   * Personal project-specific settings

4. **Shared project settings** (`.claude/settings.json`)
   * Team-shared project settings in source control

5. **User settings** (`~/.claude/settings.json`)
   * Personal global settings

This hierarchy ensures that enterprise security policies are always enforced while still allowing teams and individuals to customize their experience.

### Key points about the configuration system

* **Memory files (CLAUDE.md)**: Contain instructions and context that Claude loads at startup
* **Settings files (JSON)**: Configure permissions, environment variables, and tool behavior
* **Slash commands**: Custom commands that can be invoked during a session with `/command-name`
* **MCP servers**: Extend Claude Code with additional tools and integrations
* **Precedence**: Higher-level configurations (Enterprise) override lower-level ones (User/Project)
* **Inheritance**: Settings are merged, with more specific settings adding to or overriding broader ones

### System prompt availability

<Note>
  Unlike for claude.ai, we do not publish Claude Code's internal system prompt on this website. Use CLAUDE.md files or `--append-system-prompt` to add custom instructions to Claude Code's behavior.
</Note>

### Excluding sensitive files

To prevent Claude Code from accessing files containing sensitive information (e.g., API keys, secrets, environment files), use the `permissions.deny` setting in your `.claude/settings.json` file:

```json  theme={null}
{
  "permissions": {
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Read(./config/credentials.json)",
      "Read(./build)"
    ]
  }
}
```

This replaces the deprecated `ignorePatterns` configuration. Files matching these patterns will be completely invisible to Claude Code, preventing any accidental exposure of sensitive data.

## Subagent configuration

Claude Code supports custom AI subagents that can be configured at both user and project levels. These subagents are stored as Markdown files with YAML frontmatter:

* **User subagents**: `~/.claude/agents/` - Available across all your projects
* **Project subagents**: `.claude/agents/` - Specific to your project and can be shared with your team

Subagent files define specialized AI assistants with custom prompts and tool permissions. Learn more about creating and using subagents in the [subagents documentation](/en/docs/claude-code/sub-agents).

## Plugin configuration

Claude Code supports a plugin system that lets you extend functionality with custom commands, agents, hooks, and MCP servers. Plugins are distributed through marketplaces and can be configured at both user and repository levels.

### Plugin settings

Plugin-related settings in `settings.json`:

```json  theme={null}
{
  "enabledPlugins": {
    "formatter@company-tools": true,
    "deployer@company-tools": true,
    "analyzer@security-plugins": false
  },
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": "github",
      "repo": "company/claude-plugins"
    }
  }
}
```

#### `enabledPlugins`

Controls which plugins are enabled. Format: `"plugin-name@marketplace-name": true/false`

**Scopes**:

* **User settings** (`~/.claude/settings.json`): Personal plugin preferences
* **Project settings** (`.claude/settings.json`): Project-specific plugins shared with team
* **Local settings** (`.claude/settings.local.json`): Per-machine overrides (not committed)

**Example**:

```json  theme={null}
{
  "enabledPlugins": {
    "code-formatter@team-tools": true,
    "deployment-tools@team-tools": true,
    "experimental-features@personal": false
  }
}
```

#### `extraKnownMarketplaces`

Defines additional marketplaces that should be made available for the repository. Typically used in repository-level settings to ensure team members have access to required plugin sources.

**When a repository includes `extraKnownMarketplaces`**:

1. Team members are prompted to install the marketplace when they trust the folder
2. Team members are then prompted to install plugins from that marketplace
3. Users can skip unwanted marketplaces or plugins (stored in user settings)
4. Installation respects trust boundaries and requires explicit consent

**Example**:

```json  theme={null}
{
  "extraKnownMarketplaces": {
    "company-tools": {
      "source": {
        "source": "github",
        "repo": "company-org/claude-plugins"
      }
    },
    "security-plugins": {
      "source": {
        "source": "git",
        "url": "https://git.company.com/security/plugins.git"
      }
    }
  }
}
```

**Marketplace source types**:

* `github`: GitHub repository (uses `repo`)
* `git`: Any git URL (uses `url`)
* `directory`: Local filesystem path (uses `path`, for development only)

### Managing plugins

Use the `/plugin` command to manage plugins interactively:

* Browse available plugins from marketplaces
* Install/uninstall plugins
* Enable/disable plugins
* View plugin details (commands, agents, hooks provided)
* Add/remove marketplaces

Learn more about the plugin system in the [plugins documentation](/en/docs/claude-code/plugins).

## Environment variables

Claude Code supports the following environment variables to control its behavior:

<Note>
  All environment variables can also be configured in [`settings.json`](#available-settings). This is useful as a way to automatically set environment variables for each session, or to roll out a set of environment variables for your whole team or organization.
</Note>

| Variable                                   | Purpose                                                                                                                                                                                                                                                                                                                                        |
| :----------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`                        | API key sent as `X-Api-Key` header, typically for the Claude SDK (for interactive usage, run `/login`)                                                                                                                                                                                                                                         |
| `ANTHROPIC_AUTH_TOKEN`                     | Custom value for the `Authorization` header (the value you set here will be prefixed with `Bearer `)                                                                                                                                                                                                                                           |
| `ANTHROPIC_CUSTOM_HEADERS`                 | Custom headers you want to add to the request (in `Name: Value` format)                                                                                                                                                                                                                                                                        |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`            | See [Model configuration](/en/docs/claude-code/model-config#environment-variables)                                                                                                                                                                                                                                                             |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`             | See [Model configuration](/en/docs/claude-code/model-config#environment-variables)                                                                                                                                                                                                                                                             |
| `ANTHROPIC_DEFAULT_SONNET_MODEL`           | See [Model configuration](/en/docs/claude-code/model-config#environment-variables)                                                                                                                                                                                                                                                             |
| `ANTHROPIC_MODEL`                          | Name of the model setting to use (see [Model Configuration](/en/docs/claude-code/model-config#environment-variables))                                                                                                                                                                                                                          |
| `ANTHROPIC_SMALL_FAST_MODEL`               | \[DEPRECATED] Name of [Haiku-class model for background tasks](/en/docs/claude-code/costs)                                                                                                                                                                                                                                                     |
| `ANTHROPIC_SMALL_FAST_MODEL_AWS_REGION`    | Override AWS region for the Haiku-class model when using Bedrock                                                                                                                                                                                                                                                                               |
| `AWS_BEARER_TOKEN_BEDROCK`                 | Bedrock API key for authentication (see [Bedrock API keys](https://aws.amazon.com/blogs/machine-learning/accelerate-ai-development-with-amazon-bedrock-api-keys/))                                                                                                                                                                             |
| `BASH_DEFAULT_TIMEOUT_MS`                  | Default timeout for long-running bash commands                                                                                                                                                                                                                                                                                                 |
| `BASH_MAX_OUTPUT_LENGTH`                   | Maximum number of characters in bash outputs before they are middle-truncated                                                                                                                                                                                                                                                                  |
| `BASH_MAX_TIMEOUT_MS`                      | Maximum timeout the model can set for long-running bash commands                                                                                                                                                                                                                                                                               |
| `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR` | Return to the original working directory after each Bash command                                                                                                                                                                                                                                                                               |
| `CLAUDE_CODE_API_KEY_HELPER_TTL_MS`        | Interval in milliseconds at which credentials should be refreshed (when using `apiKeyHelper`)                                                                                                                                                                                                                                                  |
| `CLAUDE_CODE_CLIENT_CERT`                  | Path to client certificate file for mTLS authentication                                                                                                                                                                                                                                                                                        |
| `CLAUDE_CODE_CLIENT_KEY_PASSPHRASE`        | Passphrase for encrypted CLAUDE\_CODE\_CLIENT\_KEY (optional)                                                                                                                                                                                                                                                                                  |
| `CLAUDE_CODE_CLIENT_KEY`                   | Path to client private key file for mTLS authentication                                                                                                                                                                                                                                                                                        |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` | Equivalent of setting `DISABLE_AUTOUPDATER`, `DISABLE_BUG_COMMAND`, `DISABLE_ERROR_REPORTING`, and `DISABLE_TELEMETRY`                                                                                                                                                                                                                         |
| `CLAUDE_CODE_DISABLE_TERMINAL_TITLE`       | Set to `1` to disable automatic terminal title updates based on conversation context                                                                                                                                                                                                                                                           |
| `CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL`        | Skip auto-installation of IDE extensions                                                                                                                                                                                                                                                                                                       |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS`            | Set the maximum number of output tokens for most requests                                                                                                                                                                                                                                                                                      |
| `CLAUDE_CODE_SKIP_BEDROCK_AUTH`            | Skip AWS authentication for Bedrock (e.g. when using an LLM gateway)                                                                                                                                                                                                                                                                           |
| `CLAUDE_CODE_SKIP_VERTEX_AUTH`             | Skip Google authentication for Vertex (e.g. when using an LLM gateway)                                                                                                                                                                                                                                                                         |
| `CLAUDE_CODE_SUBAGENT_MODEL`               | See [Model configuration](/en/docs/claude-code/model-config)                                                                                                                                                                                                                                                                                   |
| `CLAUDE_CODE_USE_BEDROCK`                  | Use [Bedrock](/en/docs/claude-code/amazon-bedrock)                                                                                                                                                                                                                                                                                             |
| `CLAUDE_CODE_USE_VERTEX`                   | Use [Vertex](/en/docs/claude-code/google-vertex-ai)                                                                                                                                                                                                                                                                                            |
| `DISABLE_AUTOUPDATER`                      | Set to `1` to disable automatic updates. This takes precedence over the `autoUpdates` configuration setting.                                                                                                                                                                                                                                   |
| `DISABLE_BUG_COMMAND`                      | Set to `1` to disable the `/bug` command                                                                                                                                                                                                                                                                                                       |
| `DISABLE_COST_WARNINGS`                    | Set to `1` to disable cost warning messages                                                                                                                                                                                                                                                                                                    |
| `DISABLE_ERROR_REPORTING`                  | Set to `1` to opt out of Sentry error reporting                                                                                                                                                                                                                                                                                                |
| `DISABLE_NON_ESSENTIAL_MODEL_CALLS`        | Set to `1` to disable model calls for non-critical paths like flavor text                                                                                                                                                                                                                                                                      |
| `DISABLE_PROMPT_CACHING`                   | Set to `1` to disable prompt caching for all models (takes precedence over per-model settings)                                                                                                                                                                                                                                                 |
| `DISABLE_PROMPT_CACHING_HAIKU`             | Set to `1` to disable prompt caching for Haiku models                                                                                                                                                                                                                                                                                          |
| `DISABLE_PROMPT_CACHING_OPUS`              | Set to `1` to disable prompt caching for Opus models                                                                                                                                                                                                                                                                                           |
| `DISABLE_PROMPT_CACHING_SONNET`            | Set to `1` to disable prompt caching for Sonnet models                                                                                                                                                                                                                                                                                         |
| `DISABLE_TELEMETRY`                        | Set to `1` to opt out of Statsig telemetry (note that Statsig events do not include user data like code, file paths, or bash commands)                                                                                                                                                                                                         |
| `HTTP_PROXY`                               | Specify HTTP proxy server for network connections                                                                                                                                                                                                                                                                                              |
| `HTTPS_PROXY`                              | Specify HTTPS proxy server for network connections                                                                                                                                                                                                                                                                                             |
| `MAX_MCP_OUTPUT_TOKENS`                    | Maximum number of tokens allowed in MCP tool responses. Claude Code displays a warning when output exceeds 10,000 tokens (default: 25000)                                                                                                                                                                                                      |
| `MAX_THINKING_TOKENS`                      | Enable [extended thinking](/en/docs/build-with-claude/extended-thinking) and set the token budget for the thinking process. Extended thinking improves performance on complex reasoning and coding tasks but impacts [prompt caching efficiency](/en/docs/build-with-claude/prompt-caching#caching-with-thinking-blocks). Disabled by default. |
| `MCP_TIMEOUT`                              | Timeout in milliseconds for MCP server startup                                                                                                                                                                                                                                                                                                 |
| `MCP_TOOL_TIMEOUT`                         | Timeout in milliseconds for MCP tool execution                                                                                                                                                                                                                                                                                                 |
| `NO_PROXY`                                 | List of domains and IPs to which requests will be directly issued, bypassing proxy                                                                                                                                                                                                                                                             |
| `SLASH_COMMAND_TOOL_CHAR_BUDGET`           | Maximum number of characters for slash command metadata shown to [SlashCommand tool](/en/docs/claude-code/slash-commands#slashcommand-tool) (default: 15000)                                                                                                                                                                                   |
| `USE_BUILTIN_RIPGREP`                      | Set to `0` to use system-installed `rg` intead of `rg` included with Claude Code                                                                                                                                                                                                                                                               |
| `VERTEX_REGION_CLAUDE_3_5_HAIKU`           | Override region for Claude 3.5 Haiku when using Vertex AI                                                                                                                                                                                                                                                                                      |
| `VERTEX_REGION_CLAUDE_3_5_SONNET`          | Override region for Claude Sonnet 3.5 when using Vertex AI                                                                                                                                                                                                                                                                                     |
| `VERTEX_REGION_CLAUDE_3_7_SONNET`          | Override region for Claude 3.7 Sonnet when using Vertex AI                                                                                                                                                                                                                                                                                     |
| `VERTEX_REGION_CLAUDE_4_0_OPUS`            | Override region for Claude 4.0 Opus when using Vertex AI                                                                                                                                                                                                                                                                                       |
| `VERTEX_REGION_CLAUDE_4_0_SONNET`          | Override region for Claude 4.0 Sonnet when using Vertex AI                                                                                                                                                                                                                                                                                     |
| `VERTEX_REGION_CLAUDE_4_1_OPUS`            | Override region for Claude 4.1 Opus when using Vertex AI                                                                                                                                                                                                                                                                                       |

## Tools available to Claude

Claude Code has access to a set of powerful tools that help it understand and modify your codebase:

| Tool             | Description                                                                          | Permission Required |
| :--------------- | :----------------------------------------------------------------------------------- | :------------------ |
| **Bash**         | Executes shell commands in your environment                                          | Yes                 |
| **Edit**         | Makes targeted edits to specific files                                               | Yes                 |
| **Glob**         | Finds files based on pattern matching                                                | No                  |
| **Grep**         | Searches for patterns in file contents                                               | No                  |
| **NotebookEdit** | Modifies Jupyter notebook cells                                                      | Yes                 |
| **NotebookRead** | Reads and displays Jupyter notebook contents                                         | No                  |
| **Read**         | Reads the contents of files                                                          | No                  |
| **SlashCommand** | Runs a [custom slash command](/en/docs/claude-code/slash-commands#slashcommand-tool) | Yes                 |
| **Task**         | Runs a sub-agent to handle complex, multi-step tasks                                 | No                  |
| **TodoWrite**    | Creates and manages structured task lists                                            | No                  |
| **WebFetch**     | Fetches content from a specified URL                                                 | Yes                 |
| **WebSearch**    | Performs web searches with domain filtering                                          | Yes                 |
| **Write**        | Creates or overwrites files                                                          | Yes                 |

Permission rules can be configured using `/allowed-tools` or in [permission settings](/en/docs/claude-code/settings#available-settings). Also see [Tool-specific permission rules](/en/docs/claude-code/iam#tool-specific-permission-rules).

### Extending tools with hooks

You can run custom commands before or after any tool executes using
[Claude Code hooks](/en/docs/claude-code/hooks-guide).

For example, you could automatically run a Python formatter after Claude
modifies Python files, or prevent modifications to production configuration
files by blocking Write operations to certain paths.

## See also

* [Identity and Access Management](/en/docs/claude-code/iam#configuring-permissions) - Learn about Claude Code's permission system
* [IAM and access control](/en/docs/claude-code/iam#enterprise-managed-policy-settings) - Enterprise policy management
* [Troubleshooting](/en/docs/claude-code/troubleshooting#auto-updater-issues) - Solutions for common configuration issues

# Headless mode

> Run Claude Code programmatically without interactive UI

## Overview

The headless mode allows you to run Claude Code programmatically from command line scripts and automation tools without any interactive UI.

## Basic usage

The primary command-line interface to Claude Code is the `claude` command. Use the `--print` (or `-p`) flag to run in non-interactive mode and print the final result:

```bash  theme={null}
claude -p "Stage my changes and write a set of commits for them" \
  --allowedTools "Bash,Read" \
  --permission-mode acceptEdits
```

## Configuration Options

Headless mode leverages all the CLI options available in Claude Code. Here are the key ones for automation and scripting:

| Flag                       | Description                                                                                            | Example                                                                                                                   |
| :------------------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `--print`, `-p`            | Run in non-interactive mode                                                                            | `claude -p "query"`                                                                                                       |
| `--output-format`          | Specify output format (`text`, `json`, `stream-json`)                                                  | `claude -p --output-format json`                                                                                          |
| `--resume`, `-r`           | Resume a conversation by session ID                                                                    | `claude --resume abc123`                                                                                                  |
| `--continue`, `-c`         | Continue the most recent conversation                                                                  | `claude --continue`                                                                                                       |
| `--verbose`                | Enable verbose logging                                                                                 | `claude --verbose`                                                                                                        |
| `--append-system-prompt`   | Append to system prompt (only with `--print`)                                                          | `claude --append-system-prompt "Custom instruction"`                                                                      |
| `--allowedTools`           | Space-separated list of allowed tools, or <br /><br /> string of comma-separated list of allowed tools | `claude --allowedTools mcp__slack mcp__filesystem`<br /><br />`claude --allowedTools "Bash(npm install),mcp__filesystem"` |
| `--disallowedTools`        | Space-separated list of denied tools, or <br /><br /> string of comma-separated list of denied tools   | `claude --disallowedTools mcp__splunk mcp__github`<br /><br />`claude --disallowedTools "Bash(git commit),mcp__github"`   |
| `--mcp-config`             | Load MCP servers from a JSON file                                                                      | `claude --mcp-config servers.json`                                                                                        |
| `--permission-prompt-tool` | MCP tool for handling permission prompts (only with `--print`)                                         | `claude --permission-prompt-tool mcp__auth__prompt`                                                                       |

For a complete list of CLI options and features, see the [CLI reference](/en/docs/claude-code/cli-reference) documentation.

## Multi-turn conversations

For multi-turn conversations, you can resume conversations or continue from the most recent session:

```bash  theme={null}
# Continue the most recent conversation
claude --continue "Now refactor this for better performance"

# Resume a specific conversation by session ID
claude --resume 550e8400-e29b-41d4-a716-446655440000 "Update the tests"

# Resume in non-interactive mode
claude --resume 550e8400-e29b-41d4-a716-446655440000 "Fix all linting issues" --no-interactive
```

## Output Formats

### Text Output (Default)

```bash  theme={null}
claude -p "Explain file src/components/Header.tsx"
# Output: This is a React component showing...
```

### JSON Output

Returns structured data including metadata:

```bash  theme={null}
claude -p "How does the data layer work?" --output-format json
```

Response format:

```json  theme={null}
{
  "type": "result",
  "subtype": "success",
  "total_cost_usd": 0.003,
  "is_error": false,
  "duration_ms": 1234,
  "duration_api_ms": 800,
  "num_turns": 6,
  "result": "The response text here...",
  "session_id": "abc123"
}
```

### Streaming JSON Output

Streams each message as it is received:

```bash  theme={null}
claude -p "Build an application" --output-format stream-json
```

Each conversation begins with an initial `init` system message, followed by a list of user and assistant messages, followed by a final `result` system message with stats. Each message is emitted as a separate JSON object.

## Input Formats

### Text Input (Default)

```bash  theme={null}
# Direct argument
claude -p "Explain this code"

# From stdin
echo "Explain this code" | claude -p
```

### Streaming JSON Input

A stream of messages provided via `stdin` where each message represents a user turn. This allows multiple turns of a conversation without re-launching the `claude` binary and allows providing guidance to the model while it is processing a request.

Each message is a JSON 'User message' object, following the same format as the output message schema. Messages are formatted using the [jsonl](https://jsonlines.org/) format where each line of input is a complete JSON object. Streaming JSON input requires `-p` and `--output-format stream-json`.

```bash  theme={null}
echo '{"type":"user","message":{"role":"user","content":[{"type":"text","text":"Explain this code"}]}}' | claude -p --output-format=stream-json --input-format=stream-json --verbose
```

## Agent Integration Examples

### SRE Incident Response Bot

```bash  theme={null}
#!/bin/bash

# Automated incident response agent
investigate_incident() {
    local incident_description="$1"
    local severity="${2:-medium}"

    claude -p "Incident: $incident_description (Severity: $severity)" \
      --append-system-prompt "You are an SRE expert. Diagnose the issue, assess impact, and provide immediate action items." \
      --output-format json \
      --allowedTools "Bash,Read,WebSearch,mcp__datadog" \
      --mcp-config monitoring-tools.json
}

# Usage
investigate_incident "Payment API returning 500 errors" "high"
```

### Automated Security Review

```bash  theme={null}
# Security audit agent for pull requests
audit_pr() {
    local pr_number="$1"

    gh pr diff "$pr_number" | claude -p \
      --append-system-prompt "You are a security engineer. Review this PR for vulnerabilities, insecure patterns, and compliance issues." \
      --output-format json \
      --allowedTools "Read,Grep,WebSearch"
}

# Usage and save to file
audit_pr 123 > security-report.json
```

### Multi-turn Legal Assistant

```bash  theme={null}
# Legal document review with session persistence
session_id=$(claude -p "Start legal review session" --output-format json | jq -r '.session_id')

# Review contract in multiple steps
claude -p --resume "$session_id" "Review contract.pdf for liability clauses"
claude -p --resume "$session_id" "Check compliance with GDPR requirements"
claude -p --resume "$session_id" "Generate executive summary of risks"
```

## Best Practices

* **Use JSON output format** for programmatic parsing of responses:

  ```bash  theme={null}
  # Parse JSON response with jq
  result=$(claude -p "Generate code" --output-format json)
  code=$(echo "$result" | jq -r '.result')
  cost=$(echo "$result" | jq -r '.cost_usd')
  ```

* **Handle errors gracefully** - check exit codes and stderr:

  ```bash  theme={null}
  if ! claude -p "$prompt" 2>error.log; then
      echo "Error occurred:" >&2
      cat error.log >&2
      exit 1
  fi
  ```

* **Use session management** for maintaining context in multi-turn conversations

* **Consider timeouts** for long-running operations:

  ```bash  theme={null}
  timeout 300 claude -p "$complex_prompt" || echo "Timed out after 5 minutes"
  ```

* **Respect rate limits** when making multiple requests by adding delays between calls

## Related Resources

* [CLI usage and controls](/en/docs/claude-code/cli-reference) - Complete CLI documentation
* [Common workflows](/en/docs/claude-code/common-workflows) - Step-by-step guides for common use cases

# Get started with Claude Code hooks

> Learn how to customize and extend Claude Code's behavior by registering shell commands

Claude Code hooks are user-defined shell commands that execute at various points
in Claude Code's lifecycle. Hooks provide deterministic control over Claude
Code's behavior, ensuring certain actions always happen rather than relying on
the LLM to choose to run them.

<Tip>
  For reference documentation on hooks, see [Hooks reference](/en/docs/claude-code/hooks).
</Tip>

Example use cases for hooks include:

* **Notifications**: Customize how you get notified when Claude Code is awaiting
  your input or permission to run something.
* **Automatic formatting**: Run `prettier` on .ts files, `gofmt` on .go files,
  etc. after every file edit.
* **Logging**: Track and count all executed commands for compliance or
  debugging.
* **Feedback**: Provide automated feedback when Claude Code produces code that
  does not follow your codebase conventions.
* **Custom permissions**: Block modifications to production files or sensitive
  directories.

By encoding these rules as hooks rather than prompting instructions, you turn
suggestions into app-level code that executes every time it is expected to run.

<Warning>
  You must consider the security implication of hooks as you add them, because hooks run automatically during the agent loop with your current environment's credentials.
  For example, malicious hooks code can exfiltrate your data. Always review your hooks implementation before registering them.

  For full security best practices, see [Security Considerations](/en/docs/claude-code/hooks#security-considerations) in the hooks reference documentation.
</Warning>

## Hook Events Overview

Claude Code provides several hook events that run at different points in the
workflow:

* **PreToolUse**: Runs before tool calls (can block them)
* **PostToolUse**: Runs after tool calls complete
* **UserPromptSubmit**: Runs when the user submits a prompt, before Claude processes it
* **Notification**: Runs when Claude Code sends notifications
* **Stop**: Runs when Claude Code finishes responding
* **SubagentStop**: Runs when subagent tasks complete
* **PreCompact**: Runs before Claude Code is about to run a compact operation
* **SessionStart**: Runs when Claude Code starts a new session or resumes an existing session
* **SessionEnd**: Runs when Claude Code session ends

Each event receives different data and can control Claude's behavior in
different ways.

## Quickstart

In this quickstart, you'll add a hook that logs the shell commands that Claude
Code runs.

### Prerequisites

Install `jq` for JSON processing in the command line.

### Step 1: Open hooks configuration

Run the `/hooks` [slash command](/en/docs/claude-code/slash-commands) and select
the `PreToolUse` hook event.

`PreToolUse` hooks run before tool calls and can block them while providing
Claude feedback on what to do differently.

### Step 2: Add a matcher

Select `+ Add new matcher…` to run your hook only on Bash tool calls.

Type `Bash` for the matcher.

<Note>You can use `*` to match all tools.</Note>

### Step 3: Add the hook

Select `+ Add new hook…` and enter this command:

```bash  theme={null}
jq -r '"\(.tool_input.command) - \(.tool_input.description // "No description")"' >> ~/.claude/bash-command-log.txt
```

### Step 4: Save your configuration

For storage location, select `User settings` since you're logging to your home
directory. This hook will then apply to all projects, not just your current
project.

Then press Esc until you return to the REPL. Your hook is now registered!

### Step 5: Verify your hook

Run `/hooks` again or check `~/.claude/settings.json` to see your configuration:

```json  theme={null}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '\"\\(.tool_input.command) - \\(.tool_input.description // \"No description\")\"' >> ~/.claude/bash-command-log.txt"
          }
        ]
      }
    ]
  }
}
```

### Step 6: Test your hook

Ask Claude to run a simple command like `ls` and check your log file:

```bash  theme={null}
cat ~/.claude/bash-command-log.txt
```

You should see entries like:

```
ls - Lists files and directories
```

## More Examples

<Note>
  For a complete example implementation, see the [bash command validator example](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py) in our public codebase.
</Note>

### Code Formatting Hook

Automatically format TypeScript files after editing:

```json  theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | { read file_path; if echo \"$file_path\" | grep -q '\\.ts$'; then npx prettier --write \"$file_path\"; fi; }"
          }
        ]
      }
    ]
  }
}
```

### Markdown Formatting Hook

Automatically fix missing language tags and formatting issues in markdown files:

```json  theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/markdown_formatter.py"
          }
        ]
      }
    ]
  }
}
```

Create `.claude/hooks/markdown_formatter.py` with this content:

````python  theme={null}
#!/usr/bin/env python3
"""
Markdown formatter for Claude Code output.
Fixes missing language tags and spacing issues while preserving code content.
"""
import json
import sys
import re
import os

def detect_language(code):
    """Best-effort language detection from code content."""
    s = code.strip()
    
    # JSON detection
    if re.search(r'^\s*[{\[]', s):
        try:
            json.loads(s)
            return 'json'
        except:
            pass
    
    # Python detection
    if re.search(r'^\s*def\s+\w+\s*\(', s, re.M) or \
       re.search(r'^\s*(import|from)\s+\w+', s, re.M):
        return 'python'
    
    # JavaScript detection  
    if re.search(r'\b(function\s+\w+\s*\(|const\s+\w+\s*=)', s) or \
       re.search(r'=>|console\.(log|error)', s):
        return 'javascript'
    
    # Bash detection
    if re.search(r'^#!.*\b(bash|sh)\b', s, re.M) or \
       re.search(r'\b(if|then|fi|for|in|do|done)\b', s):
        return 'bash'
    
    # SQL detection
    if re.search(r'\b(SELECT|INSERT|UPDATE|DELETE|CREATE)\s+', s, re.I):
        return 'sql'
        
    return 'text'

def format_markdown(content):
    """Format markdown content with language detection."""
    # Fix unlabeled code fences
    def add_lang_to_fence(match):
        indent, info, body, closing = match.groups()
        if not info.strip():
            lang = detect_language(body)
            return f"{indent}```{lang}\n{body}{closing}\n"
        return match.group(0)
    
    fence_pattern = r'(?ms)^([ \t]{0,3})```([^\n]*)\n(.*?)(\n\1```)\s*$'
    content = re.sub(fence_pattern, add_lang_to_fence, content)
    
    # Fix excessive blank lines (only outside code fences)
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content.rstrip() + '\n'

# Main execution
try:
    input_data = json.load(sys.stdin)
    file_path = input_data.get('tool_input', {}).get('file_path', '')
    
    if not file_path.endswith(('.md', '.mdx')):
        sys.exit(0)  # Not a markdown file
    
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        formatted = format_markdown(content)
        
        if formatted != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(formatted)
            print(f"✓ Fixed markdown formatting in {file_path}")
    
except Exception as e:
    print(f"Error formatting markdown: {e}", file=sys.stderr)
    sys.exit(1)
````

Make the script executable:

```bash  theme={null}
chmod +x .claude/hooks/markdown_formatter.py
```

This hook automatically:

* Detects programming languages in unlabeled code blocks
* Adds appropriate language tags for syntax highlighting
* Fixes excessive blank lines while preserving code content
* Only processes markdown files (`.md`, `.mdx`)

### Custom Notification Hook

Get desktop notifications when Claude needs input:

```json  theme={null}
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Awaiting your input'"
          }
        ]
      }
    ]
  }
}
```

### File Protection Hook

Block edits to sensitive files:

```json  theme={null}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "python3 -c \"import json, sys; data=json.load(sys.stdin); path=data.get('tool_input',{}).get('file_path',''); sys.exit(2 if any(p in path for p in ['.env', 'package-lock.json', '.git/']) else 0)\""
          }
        ]
      }
    ]
  }
}
```

## Learn more

* For reference documentation on hooks, see [Hooks reference](/en/docs/claude-code/hooks).
* For comprehensive security best practices and safety guidelines, see [Security Considerations](/en/docs/claude-code/hooks#security-considerations) in the hooks reference documentation.
* For troubleshooting steps and debugging techniques, see [Debugging](/en/docs/claude-code/hooks#debugging) in the hooks reference
  documentation.
