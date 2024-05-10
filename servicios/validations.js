import GoogleAPIs from 'googleapis';

export async function ValidateMember(member) {
    console.log('Nuevo usuario: '+ member.user.tag)
    const guild = member.guild;
    try {
        const googleCredentials = await fetch(process.env.GOOGLE_CREDENTIALS_URL).then(response => response.json());
        console.log('Credenciales de Google cargadas desde Firebase');
        // primero creamos un objeto de autenticación usando las credenciales de Google que son de tipo "Cuentas de servicio"
        const googleAuthObject = new GoogleAPIs.Auth.JWT({ email: googleCredentials.client_email, key: googleCredentials.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
        // luego creamos un objeto de Google Sheets tomando el id del archivo de Google Sheets desde una variable de entorno
        console.log('Objeto de autenticación de Google creado');
        // ahora creamos un objeto de Google Sheets tomando el id del archivo de Google Sheets desde una variable de entorno
        const googleSheets = GoogleAPIs.google.sheets({ version: 'v4', auth: googleAuthObject });
        // Objeto de Google Sheets creado
        const spreadsheetId = process.env.GOOGLE_CREDENTIAL_SPREADSHEET_ID;
        const range = 'Respuestas de formulario 1!H2:H';
        // ahora obtenemos los valores de la hoja de Google Sheets
        const response = await googleSheets.spreadsheets.values.get({ spreadsheetId, range });
        const values = response.data.values;
        console.log('Datos de la hoja de Google Sheets cargados');
        // tomamos los datos de la columna "H" que es donde se encuentra el nombre de usuario de Discord, excluyendo la fila de encabezado
        const discordUsernames = values.map(value => value[0].toLowerCase());
        // tomamos el nombre de usuario de Discord del usuario que ingresó al servidor y lo convertimos a minúsculas
        const newMemberUsername = member.user.username.toLowerCase();
        // validamos si el nombre de usuario de Discord del usuario que ingresó al servidor se encuentra en la lista de nombres de usuario de Discord que se encuentran en la hoja de Google Sheets
        if (discordUsernames.includes(newMemberUsername)) {
            // si el nombre de usuario de Discord del usuario que ingresó al servidor se encuentra en la lista de nombres de usuario de Discord que se encuentran en la hoja de Google Sheets, entonces le asignamos el rol "Alumno"
            
            const role = guild.roles.cache.find(role => role.name == 'Alumno');
            if (role) {
                const user = guild.members.cache.find(user => user.id == member.id);
                if (user) {
                    user.roles.add(role);
                }
            }
            else{
                console.log('En el servidor '+ guild.name+ ' no se encontró el rol "Alumno"');
            }
        }
        else{
            const mensaje = 'El usuario '+ newMemberUsername+ ' no se encuentra en la lista de usuarios de Discord que se encuentran en el archivo de Google Sheets';
            console.log(mensaje);
            const owner = guild.owner;
            if (owner) {
                owner.send(mensaje);
            }
            // adicionalmente, le asignamos el rol de "Invitado-No-Verificado" al usuario que ingresó al servidor
            const role = guild.roles.cache.find(role => role.name == 'Invitado-No-Verificado');
            if (role) {
                const user = guild.members.cache.find(user => user.id == member.id);
                if (user) {
                    user.roles.add(role);
                }
            }
        }
        /*
        const googleCredentials = await import('../configs/taller-unahur-e-sports-credentials.json', { assert: { type: 'json' } });
        
        console.log('Credenciales de Google cargadas');
        const guild = member.guild;
        const role = guild.roles.cache.find(role => role.name == 'Alumno');
        if (role) {
            const user = guild.members.cache.find(user => user.id == member.id);
            if (user) {
                user.roles.add(role);
            }
        }
        else{
            console.log('En el servidor '+ guild.name+ ' no se encontró el rol "Alumno"');
        }
        */
    }
    // catch del error ERR_MODULE_NOT_FOUND
    catch (error) {
        if (error.code == 'ERR_MODULE_NOT_FOUND' && error.message.includes('taller-unahur-e-sports-credentials.json')) {
            console.error('No se encontró el archivo local de credenciales de Google.');
            /*
            console.log('Se intentará cargar las credenciales desde firebase');
            const googleCredentials = await fetch(process.env.GOOGLE_CREDENTIALS_URL).then(response => response.json());
            console.log('Credenciales de Google cargadas desde Firebase');
            // primero creamos un objeto de autenticación usando las credenciales de Google que son de tipo "Cuentas de servicio"
            const googleAuthObject = new GoogleAPIs.Auth.JWT({ email: googleCredentials.client_email, key: googleCredentials.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
            // luego creamos un objeto de Google Sheets tomando el id del archivo de Google Sheets desde una variable de entorno
            console.log('Objeto de autenticación de Google creado');
            // ahora creamos un objeto de Google Sheets tomando el id del archivo de Google Sheets desde una variable de entorno
            const googleSheets = GoogleAPIs.google.sheets({ version: 'v4', auth: googleAuthObject });
            // Objeto de Google Sheets creado
            const spreadsheetId = process.env.GOOGLE_CREDENTIAL_SPREADSHEET_ID;
            const range = 'Respuestas de formulario 1!H2:H';
            // ahora obtenemos los valores de la hoja de Google Sheets
            const response = await googleSheets.spreadsheets.values.get({ spreadsheetId, range });
            const values = response.data.values;
            console.log('Datos de la hoja de Google Sheets cargados');
            // tomamos los datos de la columna "H" que es donde se encuentra el nombre de usuario de Discord, excluyendo la fila de encabezado
            const discordUsernames = values.map(value => value[0].toLowerCase());
            // tomamos el nombre de usuario de Discord del usuario que ingresó al servidor y lo convertimos a minúsculas
            const newMemberUsername = member.user.username.toLowerCase();
            // validamos si el nombre de usuario de Discord del usuario que ingresó al servidor se encuentra en la lista de nombres de usuario de Discord que se encuentran en la hoja de Google Sheets
            if (discordUsernames.includes(newMemberUsername)) {
                // si el nombre de usuario de Discord del usuario que ingresó al servidor se encuentra en la lista de nombres de usuario de Discord que se encuentran en la hoja de Google Sheets, entonces le asignamos el rol "Alumno"
                
                const role = guild.roles.cache.find(role => role.name == 'Alumno');
                if (role) {
                    const user = guild.members.cache.find(user => user.id == member.id);
                    if (user) {
                        user.roles.add(role);
                    }
                }
                else{
                    console.log('En el servidor '+ guild.name+ ' no se encontró el rol "Alumno"');
                }
            }
            else{
                const mensaje = 'El usuario '+ newMemberUsername+ ' no se encuentra en la lista de usuarios de Discord que se encuentran en el archivo de Google Sheets';
                console.log(mensaje);
                const owner = guild.owner;
                if (owner) {
                    owner.send(mensaje);
                }
                // adicionalmente, le asignamos el rol de "Invitado-No-Verificado" al usuario que ingresó al servidor
                const role = guild.roles.cache.find(role => role.name == 'Invitado-No-Verificado');
                if (role) {
                    const user = guild.members.cache.find(user => user.id == member.id);
                    if (user) {
                        user.roles.add(role);
                    }
                }
            }


            /*
            const googleCredentials = {
                "type": process.env.GOOGLE_CREDENTIAL_TYPE,
                "project_id": process.env.GOOGLE_CREDENTIAL_PROJECT_ID,
                "private_key_id": process.env.GOOGLE_CREDENTIAL_PRIVATE_KEY_ID,
                "private_key": process.env.GOOGLE_CREDENTIAL_PRIVATE_KEY,
                "client_email": process.env.GOOGLE_CREDENTIAL_CLIENT_EMAIL,
                "client_id": process.env.GOOGLE_CREDENTIAL_CLIENT_ID,
                "auth_uri": process.env.GOOGLE_CREDENTIAL_AUTH_URI,
                "token_uri": process.env.GOOGLE_CREDENTIAL_TOKEN_URI,
                "auth_provider_x509_cert_url": process.env.GOOGLE_CREDENTIAL_AUTH_PROVIDER_X509_CERT_URL,
                "client_x509_cert_url": process.env.GOOGLE_CREDENTIAL_CLIENT_X509_CERT_URL,
                "universe_domain": process.env.GOOGLE_CREDENTIAL_UNIVERSE_DOMAIN
            };
            console.log('Credenciales de Google cargadas desde las variables de entorno');
            // primero creamos un objeto de autenticación usando las credenciales de Google que son de tipo "Cuentas de servicio"
            const googleAuthObject = new GoogleAPIs.Auth.JWT({ email: googleCredentials.client_email, key: googleCredentials.private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
            // luego creamos un objeto de Google Sheets tomando el id del archivo de Google Sheets desde una variable de entorno
            const googleSheets = GoogleAPIs.google.sheets({ version: 'v4', auth: googleAuthObject });
            const spreadsheetId = process.env.GOOGLE_CREDENTIAL_SPREADSHEET_ID;
            const range = 'Respuestas de formulario 1!H2:H';

            const response = await googleSheets.spreadsheets.values.get({ spreadsheetId, range });
            const values = response.data.values;

            console.log('Datos de la hoja de Google Sheets cargados');
            const discordUsernames = values.map(value => value[0].toLowerCase());
            const newMemberUsername = member.user.username.toLowerCase();

            if (discordUsernames.includes(newMemberUsername)) {
                const guild = member.guild;
                const role = guild.roles.cache.find(role => role.name == 'Alumno');
                if (role) {
                    const user = guild.members.cache.find(user => user.id == member.id);
                    if (user) {
                        user.roles.add(role);
                    }
                }
                else{
                    console.log('En el servidor '+ guild.name+ ' no se encontró el rol "Alumno"');
                }
            }
            else{
                const mensaje = 'El usuario '+ newMemberUsername+ ' no se encuentra en la lista de usuarios de Discord que se encuentran en el archivo de Google Sheets';
                console.log(mensaje);
                const owner = guild.owner;
                if (owner) {
                    owner.send(mensaje);
                }
                const role = guild.roles.cache.find(role => role.name == 'Invitado-No-Verificado');
            }



/*
            // luego creamos un objeto de Google Sheets
            // SE CARGA EL ARCHIVO DE GOOGLE SHEETS https://docs.google.com/spreadsheets/d/1ar2Y2z2gOWqhvM-7zrIIvHbVQJbova0L4osjOb1whwQ/edit#gid=1497190328
            const googleSheets = GoogleAPIs.google.sheets({ version: 'v4', auth: googleAuthObject });
            // ID del archivo de Google Sheets
            const spreadsheetId = process.env.GOOGLE_CREDENTIAL_SPREADSHEET_ID;
            // EN LA HOJA "Respuestas de formulario 1" SE ENCUENTRAN LOS DATOS DE LOS USUARIOS QUE SE VAN A VALIDAR
            // tomamos solo los datos de la columna "H" que es donde se encuentra el nombre de usuario de Discord, excluyendo la fila de encabezado
            const range = 'Respuestas de formulario 1!H2:H';
            const response = await googleSheets.spreadsheets.values.get({ spreadsheetId, range });
            const values = response.data.values;
            // preventivamente tomamos el valor de la celda y lo convertimos a minúsculas
            const discordUsernames = values.map(value => value[0].toLowerCase());
            // tomamos el nombre de usuario de Discord del usuario que ingresó al servidor y lo convertimos a minúsculas
            const newMemberUsername = member.user.username.toLowerCase();
            // validamos si el nombre de usuario de Discord del usuario que ingresó al servidor se encuentra en la lista de nombres de usuario de Discord
            // que se encuentran en la hoja de Google Sheets



            if (discordUsernames.includes(newMemberUsername)) {
                // si el nombre de usuario de Discord del usuario que ingresó al servidor se encuentra en la lista de nombres de usuario de Discord
                // que se encuentran en la hoja de Google Sheets, entonces le asignamos el rol "Alumno"
                const guild = member.guild;
                const role = guild.roles.cache.find(role => role.name == 'Alumno');
                if (role) {
                    const user = guild.members.cache.find(user => user.id == member.id);
                    if (user) {
                        user.roles.add(role);
                    }
                }
                else{
                    console.log('En el servidor '+ guild.name+ ' no se encontró el rol "Alumno"');
                }
            }
            else{
                console.log('El usuario '+ newMemberUsername+ ' no se encuentra en la lista de usuarios de Discord que se encuentran en el archivo de Google Sheets');
                // Le enviamos un mensaje privado al propietario del servidor para notificarle que el usuario que ingresó al servidor no se encuentra en la lista de usuarios de Discord
                const owner = guild.owner;
                if (owner) {
                    owner.send('El usuario '+ newMemberUsername+ ' no se encuentra en la lista de usuarios de Discord que se encuentran en el archivo de Google Sheets');
                }
                // adicionalmente, le asignamos el rol de "Invitado-No-Verificado" al usuario que ingresó al servidor
                const role = guild.roles.cache.find(role => role.name == 'Invitado-No-Verificado');
            }
*/
        }
        else{
            console.error(error.message+'\n'+error.stack);
        }
    }
}