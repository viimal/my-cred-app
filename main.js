const electron = require( 'electron' );
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
 
const path = require( 'path' );
const url = require( 'url' );
 
let win = {};
 
function createWindow () {

  win = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1366,
    minHeight: 768,
    resizable: true,
    title: "Vimal Data",
    icon: path.join( __dirname, "app", "assets", "logo.ico" ) } );

    // and load the index.html of the app.
    win.loadURL( url.format( {
      pathname: path.join( __dirname, "app", 'index.html' ),
      protocol: 'file:',
      slashes: true
    } ) );
}
app.on( 'ready', createWindow );