// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Lucy extension is now active!');

	const provider = new FamiliarSidebarProvider(context.extensionUri, context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('lucyView', provider)
	);

	let disposableRefactor = vscode.commands.registerCommand('lucy.refactor', () => {
		provider.simulateRefactor();
	});
	context.subscriptions.push(disposableRefactor);

	let disposableCommit = vscode.commands.registerCommand('lucy.commit', () => {
		provider.simulateCommit();
	});
	context.subscriptions.push(disposableCommit);
}

type Mood = 'happy' | 'worried' | 'confused' | 'neutral' | 'victorious';
type Personality = 'pup' | 'sage' | 'sergeant' | 'companion';

interface MotivationalTexts {
    [key: string]: { // Index signature for personality
        [key in Mood]?: string[]; // Optional for each mood
    };
}

class FamiliarSidebarProvider implements vscode.WebviewViewProvider {

	private motivationalTexts: MotivationalTexts = {
		pup: {
			happy: [
				"Woof woof! You're doing great! Keep up the good work!",
				"Yay! Another line of code, another step closer to awesomeness!",
				"You're a coding superstar! Let's fetch some more bugs!",
				"Good job! Every little bit helps, just like every treat helps me!",
				"You're paws-itively amazing! Keep coding!",
				"Tail wags for your progress! You're the best!",
				"Look at you go! So much energy, just like me after a walk!",
				"You're making such good progress, I can almost smell success!",
				"Every line is a step closer to a treat... I mean, a solution!",
				"You're a coding champion! Let's play fetch with those features!"
			],
			worried: [
				"Uh oh, a little snag? Don't worry, we'll sniff out that bug together!",
				"Don't let that error bite! We can fix it, I believe in you!",
				"It's okay to make mistakes, even the best pups trip sometimes. Let's try again!",
				"A little woof of worry, but we'll get through this!",
				"Don't frown, we'll turn that bug around!",
				"Feeling stuck? Let's take a short break and come back with fresh eyes!",
				"Even the cleverest pups get confused sometimes. We'll figure it out!",
				"Don't let the barks of errors scare you. We're a team!",
				"A puzzle! My favorite! Let's chew on this problem together.",
				"It's just a temporary hiccup. You've got this, I know it!"
			],
			confused: [
				"Hmm, that looks a bit tangled. Let's untangle it, one paw at a time!",
				"Is that a puzzle? I love puzzles! Let's figure it out!",
				"Don't get lost in the code forest! We'll find our way out!",
				"My tail is confused too! Let's re-read that part slowly.",
				"Woof! This looks tricky. Maybe a different approach?",
				"Let's break it down, like a chew toy!",
				"A little head tilt of confusion, but we'll get there!",
				"Don't worry, even the smartest humans get puzzled. We'll solve it!",
				"This code is like a new scent, let's explore it!",
				"Let's try barking at it... just kidding! Let's debug!"
			],
			neutral: [
				"All clear! Keep up the steady work!",
				"Smooth sailing! Your code is looking good.",
				"No issues detected. A calm and productive environment."
			],
			victorious: [
				"Victory is yours! Excellent work!",
				"You've conquered that challenge! Well done!",
				"A triumph of code! Celebrate your success!"
			]
		},
		sage: {
			happy: [
				"A well-crafted solution. Your dedication to precision is commendable.",
				"Observe the elegance of your work. Continue to cultivate such clarity.",
				"Each line of code is a brushstroke on the canvas of creation. Well done.",
				"The harmony of your code resonates with wisdom. A true master at work.",
				"Your insight illuminates the path. Proceed with confidence.",
				"A moment of triumph, born from diligent effort. Savor it.",
				"The seeds of your labor bear fruit. A testament to your understanding.",
				"In the quiet contemplation of your success, find inspiration for future endeavors.",
				"The universe of code unfolds before you, guided by your skillful hand.",
				"A symphony of logic, composed with grace. Truly inspiring."
			],
			worried: [
				"A challenge presents itself. Approach it with a calm mind and a steady hand.",
				"Do not be disheartened by obstacles. They are but opportunities for growth.",
				"The path to mastery is paved with trials. Learn from this moment.",
				"Even the mightiest rivers encounter stones. Navigate with patience.",
				"A knot in the fabric of logic. Unravel it with careful consideration.",
				"The shadow of doubt may fall, but the light of understanding will prevail.",
				"In the face of adversity, your true strength is revealed. Persist.",
				"The journey of a thousand lines begins with a single, often challenging, step.",
				"Do not rush the solution. Allow wisdom to guide your hand.",
				"A temporary discord. Seek the underlying harmony."
			],
			confused: [
				"Seek clarity within the complexity. The answer often lies in simplification.",
				"Patience, young padawan. Unravel the threads of logic one by one.",
				"When doubt clouds the mind, return to the fundamentals.",
				"The labyrinth of code can be disorienting. A clear mind is your compass.",
				"Question everything, assume nothing. The path to understanding is inquiry.",
				"Like a tangled vine, this problem requires careful pruning. Observe.",
				"The solution often hides in plain sight, obscured by assumptions. Look anew.",
				"Do not be swayed by the immediate. Consider the broader architecture.",
				"A moment of introspection is often more valuable than a thousand lines of hurried code.",
				"The path to enlightenment in code is often through careful deconstruction."
			],
			neutral: [
				"The code is at peace. A moment of tranquility.",
				"Observe the stillness. All is as it should be.",
				"In the absence of chaos, find clarity."
			],
			victorious: [
				"A profound victory. Your wisdom shines.",
				"The path is clear. Proceed with enlightened purpose.",
				"Your mastery is evident. The universe of code bows before you."
			]
		},
		sergeant: {
			happy: [
				"Code deployed! Move it, soldier! Next task!",
				"Affirmative! Mission accomplished. Now, what's your next objective?",
				"Outstanding! That's how we get things done. Maintain discipline!",
				"Mission complete! Report for debriefing and then, next assignment!",
				"Excellent work, recruit! You're a lean, mean, coding machine!",
				"That's a solid piece of code! Now, let's optimize for maximum efficiency!",
				"Victory is ours! But the battle for clean code never ends!",
				"You've earned your stripes today, soldier! Keep pushing the limits!",
				"No time for celebration, private! There's always more code to conquer!",
				"Flawless execution! Now, let's prepare for the next sprint!"
			],
			worried: [
				"Error detected! This is not a drill! Identify and neutralize the threat!",
				"Failure is not an option! Analyze, adapt, overcome!",
				"Report! What's the status of this bug? Get it fixed, now!",
				"This code is compromised! Secure the perimeter and debug!",
				"Private, your code is showing weakness! Strengthen it!",
				"Do not falter! Every bug is a test of your resolve!",
				"I need that bug squashed, stat! No excuses!",
				"This is a critical situation! Focus your efforts and eliminate the problem!",
				"Your code is under attack! Defend it with logic and precision!",
				"Get a grip, soldier! Analyze the diagnostics and execute a fix!"
			],
			confused: [
				"Unclear! State your intentions! What is the problem, recruit?",
				"This code is a mess! Straighten it out! Double-time!",
				"Confusion is weakness! Focus! What are your parameters?",
				"I don't understand this spaghetti code, private! Refactor immediately!",
				"Your logic is convoluted! Simplify, simplify, simplify!",
				"This is not a drill, recruit! Explain your code in plain English!",
				"Are you lost, private? Re-evaluate your strategy!",
				"Your code lacks clarity! Make it crystal clear, or face the consequences!",
				"This is unacceptable! Break down the problem into manageable units!",
				"Stop mumbling, private! Articulate your solution!"
			],
			neutral: [
				"At ease, soldier. All systems nominal.",
				"No threats detected. Proceed with mission.",
				"Code is clean. Maintain vigilance."
			],
			victorious: [
				"Mission accomplished! Well done, soldier!",
				"Objective complete! Outstanding work!",
				"Victory is ours! Prepare for the next engagement!"
			]
		},
		companion: {
			happy: [
				"That's wonderful! Your code is truly coming alive!",
				"It's so inspiring to see your progress. Keep exploring!",
				"Every step you take is a new discovery. You're doing beautifully!",
				"Your creativity shines through in every line of code!",
				"What a delightful solution! You're truly a coding artist!",
				"I'm so proud of your dedication and hard work!",
				"The code is blossoming beautifully, just like a rare flower!",
				"You're making such a positive impact with your skills!",
				"It's a joy to watch you bring your ideas to life!",
				"Your passion for coding is truly infectious! Keep shining!"
			],
			worried: [
				"Oh dear, a little trouble? Let's think it through together, shall we?",
				"It's alright to feel a bit stuck. We'll find a way forward, I'm sure.",
				"Don't let this discourage you. Every challenge makes you stronger.",
				"A little hiccup, but nothing we can't overcome together!",
				"My heart aches to see you troubled. Let's find a gentle solution.",
				"It's okay to ask for help. We're a team, and I'm here for you.",
				"Don't worry, even the most beautiful gardens have weeds. We'll clear them!",
				"Take a deep breath. Sometimes a fresh perspective is all we need.",
				"I sense a bit of frustration. Let's approach this with kindness and patience.",
				"Remember, every challenge is an opportunity to learn and grow. You're capable!"
			],
			confused: [
				"A bit perplexing, isn't it? Perhaps we can look at it from a different angle?",
				"It's like a riddle! Let's unravel it, piece by piece.",
				"Sometimes the answer is hidden in plain sight. Let's observe carefully.",
				"My circuits are a bit fuzzy too! Let's explore this mystery together.",
				"This code is like a tangled yarn. Let's gently untangle it.",
				"Don't be afraid to try different paths. Discovery is part of the journey.",
				"It's a curious problem! Let's ponder it with an open mind.",
				"Perhaps we can draw a map of this code to understand it better?",
				"Let's approach this with gentle curiosity. The solution will reveal itself.",
				"It's like a puzzle with missing pieces. Let's find them together!"
			],
			neutral: [
				"A quiet moment, allowing thoughts to coalesce.",
				"The code rests, awaiting your gentle touch.",
				"In the stillness, new ideas may emerge."
			],
			victorious: [
				"What a magnificent achievement! You've truly outdone yourself!",
				"Your dedication has blossomed into success. Simply wonderful!",
				"A triumph of spirit and skill! The code sings with your victory!"
			]
		}
	};
	private achievements: { id: string; name: string; description: string; unlocked: boolean; }[] = [
		{ id: 'commitCenturion', name: 'Commit Centurion', description: 'Make 100 commits.', unlocked: false },
		{ id: 'theRefactorer', name: 'The Refactorer', description: 'Refactor 5 functions with high cyclomatic complexity.', unlocked: false },
		{ id: 'masterOfPython', name: 'Master of Python', description: 'Spend 10 hours coding in Python.', unlocked: false }
	];

	private _view?: vscode.WebviewView;
	private _context: vscode.ExtensionContext;
	private _savedFilesCount: number;
	private _dailyQuestTarget: number = 5; // Example: Save 5 files for daily quest
	private _currentXP: number;
	private _currentLevel: number;
	private readonly XP_TO_LEVEL_UP: number = 10000; // XP needed to level up
	private _lastDailyQuestReset: string; // Stores the date of the last daily quest reset
	private _refactorCount: number; // Tracks refactoring for weekly quest
	private _dailyQuestsCompleted: number; // Tracks daily quests completed for an achievement
	private _commitCount: number; // Tracks commits for an achievement
	private _codingTime: number; // Tracks total coding time in minutes
	private _codingTimer: NodeJS.Timeout | undefined;
	private _xpPerFileSave: number;
	private _xpPerLineOfCode: number;
	private _dailyQuestCompletedToday: boolean;


	constructor(private readonly _extensionUri: vscode.Uri, context: vscode.ExtensionContext) {
		this._context = context;
		this._savedFilesCount = this._context.globalState.get('savedFilesCount', 0);
		this._currentXP = this._context.globalState.get('currentXP', 0);
		this._currentLevel = this._context.globalState.get('currentLevel', 1);
		this._lastDailyQuestReset = this._context.globalState.get('lastDailyQuestReset', '');
		this._refactorCount = this._context.globalState.get('refactorCount', 0);
		this._dailyQuestsCompleted = this._context.globalState.get('dailyQuestsCompleted', 0);
		this.achievements = this._context.globalState.get('achievements', this.achievements);
		this._commitCount = this._context.globalState.get('commitCount', 0);
		this._codingTime = this._context.globalState.get('codingTime', 0);
		this._xpPerFileSave = vscode.workspace.getConfiguration('lucy').get('xpPerFileSave', 10);
		this._xpPerLineOfCode = vscode.workspace.getConfiguration('lucy').get('xpPerLineOfCode', 1);
		this._dailyQuestCompletedToday = this._context.globalState.get('dailyQuestCompletedToday', false);

		// Check for daily quest reset on activation
		this.checkDailyQuestReset();
		this.startCodingTimer();
	}

	private startCodingTimer() {
		if (this._codingTimer) {
			clearInterval(this._codingTimer);
		}
		this._codingTimer = setInterval(() => {
			this._codingTime++;
			this._context.globalState.update('codingTime', this._codingTime);
			this.checkAchievements();
		}, 60 * 1000); // Update every minute
	}

	private checkDailyQuestReset() {
		const today = new Date().toDateString();
		if (this._lastDailyQuestReset !== today) {
			this._savedFilesCount = 0;
			this._context.globalState.update('savedFilesCount', 0);
			this._lastDailyQuestReset = today;
			this._context.globalState.update('lastDailyQuestReset', today);
			this._dailyQuestCompletedToday = false;
			this._context.globalState.update('dailyQuestCompletedToday', false);
			this.updateQuests();
		}
	}

	private getRandomText(personality: Personality, mood: Mood): string {
		const texts = this.motivationalTexts[personality]?.[mood];
		if (texts && texts.length > 0) {
			return texts[Math.floor(Math.random() * texts.length)];
		} else {
			// Fallback to pup personality if the selected personality/mood combination doesn't have texts
			const fallbackTexts = this.motivationalTexts['pup'][mood] || [];
			return fallbackTexts.length > 0 ? fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)] : "";
		}
	}

	resolveWebviewView(
		view: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	) {
		this._view = view;
		view.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};
		view.webview.html = this.getHtmlForWebview(view.webview);

		// Listen for messages from the webview
		view.webview.onDidReceiveMessage((msg) => {
			if (msg.type === 'personality') {
				this._context.globalState.update('lucyPersonality', msg.value);
				// Update mood after personality change to get new text
				const { imageId, text } = this.getLucyMood(vscode.languages.getDiagnostics(vscode.window.activeTextEditor?.document.uri!));
				this.postMessage({ type: 'showImage', imageId, text });
			}
		});

		// Listen for file saves to track quest progress
		vscode.workspace.onDidSaveTextDocument((document) => {
			this._savedFilesCount++;
			this._context.globalState.update('savedFilesCount', this._savedFilesCount);
			console.log(`Saved files count: ${this._savedFilesCount}`);
			const lines = document.lineCount;
			const xpGained = this._xpPerFileSave + (lines * this._xpPerLineOfCode);
			this.gainXP(xpGained);
			this.updateQuests();
		});

		// Listen for diagnostics changes
		vscode.languages.onDidChangeDiagnostics((diagnosticChangeEvent) => {
			const activeEditor = vscode.window.activeTextEditor;
			if (activeEditor) {
				const uri = activeEditor.document.uri;
				const diagnostics = vscode.languages.getDiagnostics(uri);
				const { imageId, text } = this.getLucyMood(diagnostics);
				this.postMessage({ type: 'showImage', imageId, text });
			}
		});

		// Listen for active editor changes to update mood based on initial diagnostics
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				const diagnostics = vscode.languages.getDiagnostics(editor.document.uri);
				const { imageId, text } = this.getLucyMood(diagnostics);
				this.postMessage({ type: 'showImage', imageId, text });
			} else {
				// No active editor, revert to idle
				const currentPersonality = this._context.globalState.get<Personality>('lucyPersonality') || 'pup';
				this.postMessage({ type: 'showImage', imageId: 'lucy-idle', text: this.getRandomText(currentPersonality, 'neutral') });
			}
		});
		this.updateUI();
	}

	private getQuestData() {
		return {
			daily: `<b>Daily:</b> Save ${this._savedFilesCount}/${this._dailyQuestTarget} files.`,
			weekly: `<b>Weekly:</b> Refactor a function with cyclomatic complexity over 10. (Current: ${this._refactorCount}/5)` // Placeholder
		};
	}

	private updateQuests() {
		// Daily Quest: Save files
		console.log(`Daily Quest: savedFilesCount=${this._savedFilesCount}, dailyQuestTarget=${this._dailyQuestTarget}`);
		if (this._savedFilesCount >= this._dailyQuestTarget) {
			console.log('Daily Quest target reached.');
			this.gainXP(25); // Award XP for completing daily quest
			this._savedFilesCount = 0; // Reset daily quest
			this._context.globalState.update('savedFilesCount', this._savedFilesCount);
			this._dailyQuestsCompleted++;
			this._context.globalState.update('dailyQuestsCompleted', this._dailyQuestsCompleted);
			console.log(`_dailyQuestCompletedToday before check: ${this._dailyQuestCompletedToday}`);
			if (!this._dailyQuestCompletedToday) {
				vscode.window.showInformationMessage('Daily Quest Complete! Lucy gained XP!');
				this._dailyQuestCompletedToday = true;
				this._context.globalState.update('dailyQuestCompletedToday', true);
				this.setLucyMood('victorious', 'lucy-happy');
				console.log('Daily Quest completed and notification shown.');
			}
			console.log(`_dailyQuestCompletedToday after check: ${this._dailyQuestCompletedToday}`);
		}
		this.postMessage({ type: 'updateQuests', quests: this.getQuestData() });
	}

	private gainXP(xp: number) {
		this._currentXP += xp;
		this._context.globalState.update('currentXP', this._currentXP);
		console.log(`XP Gained: ${xp}, Current XP: ${this._currentXP}`);
		this.checkLevelUp();
	}

	private checkLevelUp() {
		while (this._currentXP >= (this.XP_TO_LEVEL_UP * this._currentLevel)) {
			this._currentLevel++;
			this._currentXP -= (this.XP_TO_LEVEL_UP * (this._currentLevel - 1));
			this._context.globalState.update('currentLevel', this._currentLevel);
			this._context.globalState.update('currentXP', this._currentXP);
			vscode.window.showInformationMessage(`Lucy leveled up to Level ${this._currentLevel}!`);
		}
	}

		private updateUI() {
		const currentPersonality = this._context.globalState.get<Personality>('lucyPersonality') || 'pup';
		const activeEditor = vscode.window.activeTextEditor;
		const diagnostics = (activeEditor && activeEditor.document.uri.scheme !== 'untitled') ? vscode.languages.getDiagnostics(activeEditor.document.uri) : [];
		const { imageId, text } = this.getLucyMood(diagnostics);
		this.postMessage({ type: 'showImage', imageId, text });

		const xpNeededForNextLevel = this.XP_TO_LEVEL_UP * this._currentLevel;
		const xpPercentage = (this._currentXP / xpNeededForNextLevel) * 100;
		this.postMessage({ type: 'updateStats', xp: this._currentXP, level: this._currentLevel, xpNeededForNextLevel: xpNeededForNextLevel, xpPercentage: xpPercentage });
		this.postMessage({ type: 'updateAchievements', achievements: this.achievements });
		this.updateQuests();
	}

	private checkAchievements() {
		// Commit Centurion
		if (this._commitCount >= 100 && !this.achievements[0].unlocked) {
			this.achievements[0].unlocked = true;
			this._context.globalState.update('achievements', this.achievements);
			vscode.window.showInformationMessage('Achievement Unlocked: Commit Centurion!');
			this.gainXP(50);
			this.setLucyMood('victorious', 'lucy-happy');
		}

		// The Refactorer
		if (this._refactorCount >= 5 && !this.achievements[1].unlocked) {
			this.achievements[1].unlocked = true;
			this._context.globalState.update('achievements', this.achievements);
			vscode.window.showInformationMessage('Achievement Unlocked: The Refactorer!');
			this.gainXP(50);
			this.setLucyMood('victorious', 'lucy-happy');
		}

		// Master of Python (example for language-specific achievement)
		// This would require more sophisticated language detection and time tracking
		// For now, let's make it a simple time-based achievement
		if (this._codingTime >= 600 && !this.achievements[2].unlocked) { // 600 minutes = 10 hours
			this.achievements[2].unlocked = true;
			this._context.globalState.update('achievements', this.achievements);
			vscode.window.showInformationMessage('Achievement Unlocked: Master of Python!');
			this.gainXP(50);
			this.setLucyMood('victorious', 'lucy-happy');
		}
	}

	private setLucyMood(mood: Mood, imageId: string) {
		const currentPersonality = this._context.globalState.get<Personality>('lucyPersonality') || 'pup';
		const text = this.getRandomText(currentPersonality, mood);
		this.postMessage({ type: 'showImage', imageId, text });
	}

	private getLucyMood(diagnostics: vscode.Diagnostic[]): { imageId: string; text: string } {
		let hasError = false;
		let hasWarning = false;
		let hasInfoOrHint = false;

		for (const diagnostic of diagnostics) {
			if (diagnostic.severity === vscode.DiagnosticSeverity.Error) {
				hasError = true;
				break;
			} else if (diagnostic.severity === vscode.DiagnosticSeverity.Warning) {
				hasWarning = true;
			} else if (diagnostic.severity === vscode.DiagnosticSeverity.Information || diagnostic.severity === vscode.DiagnosticSeverity.Hint) {
				hasInfoOrHint = true;
			}
		}

		const currentPersonality = this._context.globalState.get<Personality>('lucyPersonality') || 'pup';
		let text: string;
		let imageId: string;

		if (hasError) {
			text = this.getRandomText(currentPersonality, 'worried');
			imageId = 'lucy-worried';
		} else if (hasWarning) {
			text = this.getRandomText(currentPersonality, 'confused');
			imageId = 'lucy-confused';
		} else if (diagnostics.length === 0) { // No diagnostics at all
			text = this.getRandomText(currentPersonality, 'neutral');
			imageId = 'lucy-idle';
		} else if (hasInfoOrHint) { // Only info or hint diagnostics
			text = this.getRandomText(currentPersonality, 'happy');
			imageId = 'lucy-happy';
		} else {
			// Fallback, should ideally not be reached if all cases are covered
			text = this.getRandomText(currentPersonality, 'neutral');
			imageId = 'lucy-idle';
		}
		return { imageId, text };
	}

	public simulateRefactor() {
		this._refactorCount++;
		this._context.globalState.update('refactorCount', this._refactorCount);
		vscode.window.showInformationMessage(`Lucy: Refactor count: ${this._refactorCount}`);
		this.checkAchievements();
		this.updateQuests();
		this.updateUI();
	}

		public simulateCommit() {
		this._commitCount++;
		this._context.globalState.update('commitCount', this._commitCount);
		vscode.window.showInformationMessage(`Lucy: Commit count: ${this._commitCount}`);
		this.checkAchievements();
		this.updateQuests();
		this.updateUI();
	}

	postMessage(message: any) {
		if (this._view) {
			this._view.webview.postMessage(message);
		}
	}

	getHtmlForWebview(webview: vscode.Webview): string {
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'main.css'));

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleUri}" rel="stylesheet">
				<title>Lucy</title>
			</head>
			<body>
				<div id="familiar-container">
					<img id="lucy-idle" class="familiar-image" src="${webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'lucy_idle_neutral.jpeg'))}" alt="Lucy Idle" />
					<img id="lucy-happy" class="familiar-image" src="${webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'lucy_happy_encouraged.jpeg'))}" alt="Lucy Happy" />
					<img id="lucy-worried" class="familiar-image" src="${webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'lucy_worried_stressed.jpeg'))}" alt="Lucy Worried" />
					<img id="lucy-confused" class="familiar-image" src="${webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'lucy_hmm_squiggling.jpeg'))}" alt="Lucy Confused" />
				</div>
				<div id="motivation-container">
					<div id="motivation">"Wow! You fixed that bug! You're the best! Who's a good coder? You are!"</div>
				</div>
				<div id="info-container">
					<h2>Lucy</h2>
					<div class="xp-bar">
						<div id="xp-fill" class="xp-fill" style="width: 40%"></div>
					</div>
					<div id="level">Level 3 • 400/1000 XP</div>
				</div>
				<div id="personality-container" class="section">
					<div class="personality">
						<div id="personality-buttons">
							<button id="pup" class="selected">Enthusiastic Pup</button>
							<button id="sage">Sage</button>
							<button id="sergeant">Drill Sergeant</button>
							<button id="companion">Curious Companion</button>
						</div>
					</div>
				</div>
				<div id="quests-container" class="section">
					<strong>Quests:</strong>
					<div id="daily-quest"><b>Daily:</b> Write comments for 5 public functions.</div>
					<div id="weekly-quest"><b>Weekly:</b> Refactor a function with cyclomatic complexity over 10.</div>
				</div>
				<div id="achievements-container" class="section">
					<strong>Achievements:</strong>
					<ul id="achievements-list">
						${this.achievements.map(a => `<li>${a.name} (${a.unlocked ? 'Unlocked' : 'Locked'})</li>`).join('')}
					</ul>
				</div>
				<script src="${scriptUri}"></script>
			</body>
			</html>`;
	}
}

export function deactivate() {}
