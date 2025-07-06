
declare function acquireVsCodeApi(): any;

const vscode = acquireVsCodeApi();

document.addEventListener('DOMContentLoaded', () => {
    const familiarImages = document.querySelectorAll<HTMLImageElement>('.familiar-image');

    function showImage(imageId: string) {
        familiarImages.forEach((img: HTMLImageElement) => {
            if (img.id === imageId) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
    }

    

    window.addEventListener('message', (event: MessageEvent) => {
        const message = event.data;
        switch (message.type) {
            case 'showImage':
                showImage(message.imageId);
                if (message.text) {
                    const motivationDiv = document.getElementById('motivation');
                    if (motivationDiv) {
                        motivationDiv.textContent = message.text;
                    }
                }
                break;
            case 'updateQuests':
                if (message.quests) {
                    const dailyQuestDiv = document.getElementById('daily-quest');
                    const weeklyQuestDiv = document.getElementById('weekly-quest');
                    if (dailyQuestDiv) {
                        dailyQuestDiv.innerHTML = message.quests.daily;
                    }
                    if (weeklyQuestDiv) {
                        weeklyQuestDiv.innerHTML = message.quests.weekly;
                    }
                }
                break;
            case 'updateStats':
                if (message.xp !== undefined && message.level !== undefined && message.xpNeededForNextLevel !== undefined && message.xpPercentage !== undefined) {
                    const xpFill = document.getElementById('xp-fill');
                    const levelDiv = document.getElementById('level');
                    if (xpFill) {
                        xpFill.style.width = `${message.xpPercentage}%`;
                    }
                    if (levelDiv) {
                        levelDiv.textContent = `Level ${message.level} • ${message.xp}/${message.xpNeededForNextLevel} XP`;
                    }
                }
                break;
            case 'updateAchievements':
                if (message.achievements) {
                    const achievementsList = document.getElementById('achievements-list');
                    if (achievementsList) {
                        achievementsList.innerHTML = ''; // Clear existing achievements
                        message.achievements.forEach((achievement: any) => {
                            const listItem = document.createElement('li');
                            listItem.textContent = achievement.name + (achievement.unlocked ? ' (Unlocked)' : ' (Locked)');
                            if (achievement.unlocked) {
                                listItem.classList.add('unlocked');
                            }
                            achievementsList.appendChild(listItem);
                        });
                    }
                }
                break;
        }
    });

    // Personality button logic (existing)
    const personalityButtons = document.querySelectorAll<HTMLButtonElement>('#personality-buttons button');
    personalityButtons.forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', () => {
            personalityButtons.forEach((btn: HTMLButtonElement) => btn.classList.remove('selected'));
            button.classList.add('selected');
            vscode.postMessage({ type: 'personality', value: button.id });
        });
    });
});
