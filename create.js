const rexec = require('remote-exec');
const userData = {
    username: 'atlante',
    rootPath: '/home/atlante/public_html/abchdefg',
}


const test = true;
const themesPath = `/wp-content/themes/`;
const pluginsPath = `/wp-content/plugins/`
const _printPath = (cPanelUser) => test ? `/home/${cPanelUser}/public_html/abchdefg/` : `/home/${cPanelUser}/public_html/`


// see documentation for the ssh2 npm package for a list of all options 
var connection_options = {
    port: 2200,
    username: 'root',
    privateKey: require('fs').readFileSync('./id_rsa.txt'),
    passphrase: 'Leyla!!24&*',
};

var hosts = [
    '104.193.110.82',
];
/*
var cmds = [
    'su - atlante -c ls',
    'rm -r /home/atlante/public_html/abchdefg',
    'mkdir /home/atlante/public_html/abchdefg',
    'wget -O /home/atlante/public_html/abchdefg/latest.tar.gz http://wordpress.org/latest.tar.gz',
    'tar -xvf /home/atlante/public_html/abchdefg/latest.tar.gz -C /home/atlante/public_html/abchdefg/',
    'mv /home/atlante/public_html/abchdefg/wordpress/* /home/atlante/public_html/abchdefg/',
    'rm /home/atlante/public_html/abchdefg/latest.tar.gz',
    'wget -O /home/atlante/public_html/abchdefg/Divi.zip https://drummerboyhosting.com/Divi.zip',
    'unzip /home/atlante/public_html/abchdefg/Divi.zip -d /home/atlante/public_html/abchdefg/wp-content/themes/',
    'rm /home/atlante/public_html/abchdefg/Divi.zip',
];

rexec(hosts, cmds, connection_options, function (err) {
    if (err) {
        console.error('Error got thrown.', err);
    } else {
        console.log('Great Success!!');
    }
});
 */

const connectToServer = (context) => new Promise((resolve, reject) => {
    // return console.log('here ya goooooooooooooal!', context) || reject('error');
    const {
        cPanelUser,
        databaseName,
        databaseUser,
        databasePassword,
        url,
        dbPrefix
    } = context;
    const dbName = `${dbPrefix}_${databaseName}`
    const dbUser = `${dbPrefix}_${databaseUser}`
    const installPath = `/home/${cPanelUser}/public_html`
    const databaseCMDS = [
        `su - ${cPanelUser} -c 'wp core download --path=${installPath}'`,
        `su - ${cPanelUser} -c 'cd ${installPath}'`,
        // here we only add ${cPanelUser} as the cpanel user to update a database for
        `uapi --user=${cPanelUser} Mysql create_database name=${dbName}`,
        // here we only add ${cPanelUser} as the cpanel user to update a database for
        `uapi --user=${cPanelUser} Mysql create_user name=${dbUser} password=${databasePassword}`,
        // here we only add ${cPanelUser} as the cpanel user to update a database for
        `uapi --user=${cPanelUser} Mysql set_privileges_on_database user=${dbUser} database=${dbName} privileges=ALL`,
        `su - ${cPanelUser} -c 'cd ${installPath} && wp config create --dbhost=localhost --dbname=${dbName} --dbuser=${dbUser} --dbpass=${databasePassword}'`,
        `chmod 644 ${installPath}/wp-config.php`,
        `su - ${cPanelUser} -c 'cd ${installPath} && wp core install --url=${url} --title=Welcome --admin_user=atlante0121 --admin_password=Leyla!!2478! --admin_email=atlanteavila@gmail.com'`,
        // `wget -O ${installPath}/Divi.zip https://drummerboyhosting.com/Divi.zip`,
        // `unzip -a ${installPath}/Divi.zip -d ${installPath}/wp-content/themes`,
        `su - ${cPanelUser} -c 'wp theme install https://drummerboyhosting.com/Divi.zip --path=${installPath} --activate'`,
        // `rm -f ${installPath}/Divi.zip`,
    ];
    return rexec(hosts, databaseCMDS, connection_options, function (err) {
        if (err) {
            console.error('Error got thrown.', err);
            reject(false)
        } else {
            console.log('Great Success!!');
            resolve(true);

        }
    });

})

const createDatabase = (cPanelUser, databaseName, databaseUser, databasePassword,) => new Promise((resolve, reject) => {
    const dbName = `${cPanelUser}_${databaseName}`
    const dbUser = `${cPanelUser}_${databaseUser}`
    const databaseCMDS = [
        // here we only add atlante as the cpanel user to update a database for
        `uapi --user=${cPanelUser} Mysql create_database name=${dbName}`,
        // here we only add atlante as the cpanel user to update a database for
        `uapi --user=${cPanelUser} Mysql create_user name=${dbUser} password=${databasePassword}`,
        // here we only add atlante as the cpanel user to update a database for
        `uapi --user=${cPanelUser} Mysql set_privileges_on_database user=${dbUser} database=${dbName} privileges=ALL`
    ];
    return rexec(hosts, databaseCMDS, connection_options, function (err) {
        if (err) {
            console.error('Error got thrown.', err);
            reject('An error occurred: ' + err);
        } else {
            console.log('Great Success!!');
            resolve(true);
        }
    });
})
const activateWordPress = (cPanelUser, databaseName, databaseUser, databasePassword, title, admin_user, admin_password, admin_email) => new Promise((resolve, reject) => {
    const wpPath = `${_printPath(cPanelUser)}`;
    const databaseCMDS = [

        `su - atlante -c 'wp core download --path=/home/atlante/public_html/abchdefg'`,
        /* 
        `sed -i 's/database_name_here/${databaseName}/g' /home/${cPanelUser}/public_html/abchdefg/wp-config-sample.php`,
        `sed -i 's/username_here/${databaseUser}/g' /home/${cPanelUser}/public_html/abchdefg/wp-config-sample.php`,
        `sed -i 's/password_here/${databasePassword}/g' /home/${cPanelUser}/public_html/abchdefg/wp-config-sample.php`,
        `define( 'AUTH_KEY',         'put your unique phrase here' )`,
        `define( 'SECURE_AUTH_KEY',  'put your unique phrase here' )`,
        `define( 'LOGGED_IN_KEY',    'put your unique phrase here' )`,
        `define( 'NONCE_KEY',        'put your unique phrase here' )`,
        `define( 'AUTH_SALT',        'put your unique phrase here' )`,
        `define( 'SECURE_AUTH_SALT', 'put your unique phrase here' )`,
        `define( 'LOGGED_IN_SALT',   'put your unique phrase here' )`,
        `define( 'NONCE_SALT',       'put your unique phrase here' )`, 
        */
    ];
    return rexec(hosts, databaseCMDS, connection_options, function (err) {
        if (err) {
            console.log('Error got thrown.', err);
            reject('An error occurred: ' + err);
        } else {
            console.log('Great Success!!');
            resolve(true);
        }
    });
})

module.exports = {
    createDatabase,
    activateWordPress,
    connectToServer
}