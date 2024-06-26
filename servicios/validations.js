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
        const range2024 = 'Respuestas de formulario 1!H2:H';
        const range2023 = 'Respuestas de formulario 3!H2:H';
        // ahora obtenemos los valores de la hoja de Google Sheets
        const response2024 = await googleSheets.spreadsheets.values.get({ spreadsheetId, range: range2024 });
        const response2023 = await googleSheets.spreadsheets.values.get({ spreadsheetId, range: range2023 });
        const values2024 = response2024.data.values;
        const values2023 = response2023.data.values;
        console.log('Datos de la hoja de Google Sheets cargados');
        // tomamos los datos de la columna "H" que es donde se encuentra el nombre de usuario de Discord, excluyendo la fila de encabezado
        const discordUsernames2024 = values2024.map(value2024 => value2024[0] ? value2024[0].toLowerCase() : ' ');
        console.log('Nombres 2024 cargados');
        const discordUsernames2023 = values2023.map(value2023 => value2023[0] ? value2023[0].toLowerCase() : ' ');
        console.log('Nombres 2023 cargados');
        // tomamos el nombre de usuario de Discord del usuario que ingresó al servidor y lo convertimos a minúsculas
        const newMemberUsername = member.user.username.toLowerCase();
        // validamos si el nombre de usuario de Discord del usuario que ingresó al servidor se encuentra en la lista de nombres de usuario de Discord que se encuentran en la hoja de Google Sheets
        if (discordUsernames2024.includes(newMemberUsername) || discordUsernames2023.includes(newMemberUsername)) {
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
    }
    catch (error) {
        console.error(error.message+'\n'+error.stack);
    }
}