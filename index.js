const { app, BrowserWindow } = require('electron');
const Mojang = require('./app/js/mojang.js')

async function createGui() {
	const statuses = await Mojang.status()
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
	      	nodeIntegration: true, // TODO: Remove it : enabled by default in Electron v12
	      	enableRemoteModule: false, // turn off remote
	        disableBlinkFeatures: 'Auxclick'
		}
	});

	win.setMenuBarVisibility(false)
	win.loadFile('app/index.html');

    win.webContents.on('did-finish-load', ()=>{
    	win.setTitle("Hey");
    	for(let i=0; i<statuses.length; i++){
    		const service = statuses[i]

			// Mojang API is broken for sessionserver. https://bugs.mojang.com/browse/WEB-2303
            if(service.service === 'sessionserver.mojang.com') {
                service.status = 'green'
            }

			let code = `addElement("H2", "${service.status}", "The service : ${service.name} is <span>${service.status}</span>")`;

			win.webContents.executeJavaScript(code);
    	}
	});
}

app.whenReady().then(createGui);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
