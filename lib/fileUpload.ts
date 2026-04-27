import Client from 'ssh2-sftp-client';
import { ConnectOptions } from 'ssh2-sftp-client';
import sharp from 'sharp';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const FileUpload = async (file: File) => {
	const sftp = new Client();
	const maxAttempts = 3;

	if (!file) {
		return {
			code: 201,
			message: 'Brak pliku',
			img: ''
		};
	}

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	const newFormat = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();
	const newFileName = file.name.replace(/\.[^/.]+$/, '.jpg');

	const config: ConnectOptions = {
		host: process.env.SFTP_HOST,
		port: Number(process.env.SFTP_PORT),
		username: process.env.SFTP_USER,
		password: process.env.SFTP_PASSWORD,
		readyTimeout: 5000
	};

	const remotePath = `${process.env.SFTP_BASE_PATH}/${newFileName}`;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
		try {
			console.log(`Próba uploadu ${attempt} z ${maxAttempts}...`);

			await sftp.connect(config);
			await sftp.put(newFormat, remotePath);
			await sftp.end();

			return {
				code: 200,
				message: 'Plik wysłany na SFTP',
				img: process.env.NEXT_PUBLIC_IMAGE_URL + newFileName
			};

		} catch (error) {
			console.error(`Błąd w próbie ${attempt}:`);

			try {
				await sftp.end();
			} catch (e) {
			}

			if (attempt === maxAttempts) {
				return {
					code: 400,
					message: 'Błąd serwera SFTP',
					img: ''
				};
			}

			await delay(1000);
		}
	}
};