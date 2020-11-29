const exec = require('child_process').exec;
const zipdir = require('zip-dir');
const fs = require('fs');

const timestamp = () => {
    const date = new Date();
    
    return [
        date.getFullYear(),
        ('0' + (date.getMonth() + 1)).slice(-2),
        ('0' + date.getDate()).slice(-2),
    ].join('');
}

exec('npx react-scripts build', (err, stdout, stderr) => {
    if (err) {
        console.log(err);
    }
    console.log(stdout);

    exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
        }
        const branch = stdout.trim();
        const fileNameBase = branch === 'master' ?
            `build-${timestamp()}` :
            `build-${branch}-${timestamp()}`;
        let inc = 1;
        let fileName = `${fileNameBase}-${inc}.zip`;
        while (fs.existsSync(fileName)) {
            inc += 1;
            fileName = `${fileNameBase}-${inc}.zip`;
        }
    
        zipdir('build', { saveTo: fileName }, (err) => {
            if (err) console.log(err);
        });
    });
});
