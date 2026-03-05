# Integración de Backend con n8n para SINERGIA

El formulario de contacto está preparado para enviar los datos: **Nombre**, **Email**, **Teléfono** y **Mensaje** en formato JSON.

## Pasos para conectar con n8n:

1. **Crear Webhook en n8n**:
   - Crea un nuevo workflow en n8n.
   - Añade un nodo **"Webhook"**.
   - Configura el método como `POST`.
   - Copia la **URL del Webhook (Production o Test)**.

2. **Actualizar el código de la web**:
   - Abre el archivo `script.js`.
   - Busca la línea donde dice `AQUÍ SE CONECTARÍA CON EL WEBHOOK DE n8n`.
   - Reemplaza el bloque de comentario por la llamada fetch real:

```javascript
const response = await fetch('TU_URL_DE_WEBHOOK_AQUÍ', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});

if (response.ok) {
    // Código de éxito
} else {
    // Código de error
}
```

3. **Configurar Respuesta Automática en n8n**:
   - Conecta el nodo Webhook a un nodo de **Google Sheets**, **Baserow**, o directamente a un nodo de **Email (Gmail/Outlook)**.
   - Crea una plantilla de respuesta que utilice el campo `{{ $json.name }}` para personalizar la respuesta.

## Estructura de Datos (JSON Payload):
```json
{
  "name": "Nombre del cliente",
  "email": "cliente@email.com",
  "phone": "+541122334455",
  "message": "Mensaje opcional"
}
```
