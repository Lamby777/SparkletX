import {db}			from "./db";

// SQL prepared statements
namespace statements {
	export const prepopulate = [
		db.prepare(`
			INSERT INTO news(title, author, content) VALUES (
				'Test Article',
				'Dexie',
				'<p>This was written to test SQL queries.</p>'
			);
		`),
		
		db.prepare(`
			INSERT INTO news(title, content) VALUES (
				'Test Article 2',
				'<p>This was written to test CSS with multiple articles.</p>'
			);
		`),
		
		db.prepare(`
			INSERT INTO games(title, creator, id) VALUES (
				'Speedrun Wordle',
				'Dexie',
				'hackathon-wordle'
			);
		`),
		
		db.prepare(`
			INSERT INTO games(title, creator, id) VALUES (
				'Sparkwave',
				'Dexie',
				'sparkwave'
			);
		`),
	];

	export const updateBio = db.prepare(`
		UPDATE users
		SET bio = ?
		WHERE name = ? COLLATE NOCASE
	`);
	
	export const editLoginToken = db.prepare(`
		UPDATE users
		SET authToken = ?
		WHERE name = ? COLLATE NOCASE
	`);
	
	export const editAdminRank = db.prepare(`
		UPDATE users
		SET adminRank = ?
		WHERE name = ? COLLATE NOCASE
	`);

	export const getUser = db.prepare(`
		SELECT name, uuid, adminRank, bio FROM users
		WHERE name = ? COLLATE NOCASE
	`);

	export const getUserPH = db.prepare(`
		SELECT name, uuid, passHash FROM users
		WHERE name = ? COLLATE NOCASE
	`);

	export const registerUser = db.prepare(`
		INSERT INTO users(name, passHash, uuid)
		VALUES(?, ?, ?)
	`);

	export const getGame = db.prepare(`
		SELECT rowid, * FROM games
		WHERE id = (?) AND visible = 1
	`);

	export const gameQPosts = db.prepare(`
		SELECT rowid, *
		FROM games WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`);

	export const getNews = db.prepare(`
		SELECT rowid, * FROM news
		WHERE rowid = (?) AND visible = 1
	`);

	export const newsQPosts = db.prepare(`
		SELECT title, author, date, rowid
		FROM news WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`);

	export const capsuleQPosts = db.prepare(`
		SELECT uuid, date
		FROM capsules WHERE visible = 1
		ORDER BY rowid DESC
		LIMIT 25
	`);
}

export default statements;