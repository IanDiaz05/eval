function initialize() {
    console.log('script eval cargado');

    window.env = {
        OPENAI_API_KEY:'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',
        OPENAI_BASE_URL:'https://openrouter.ai/api/v1/chat/completions'
    };

    async function obtenerRespuesta(prompt) {
        try {
            console.log('generando respuesta...');
            const response = await fetch(`${window.env.OPENAI_BASE_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.env.OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "deepseek/deepseek-r1:free",
                    messages: [{ role: "user", content: prompt }],
                    // max_tokens: 100, // Ajusta el largo de la respuesta
                    temperature: 0.1, // Ajusta la creatividad
                    top_p: 0.2// Ajusta la diversidad
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la solicitud:\n", errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('respuesta completa:', data);
            if (data.choices && data.choices.length > 0) {
                console.log('respuesta generada:', data.choices[0].message.content.trim());
                return data.choices[0].message.content.trim();
            } else {
                console.error('No se encontraron opciones en la respuesta:', data);
                return '';
            }
        } catch (error) {
            console.error("Error en la solicitud:\n", error);
            throw error;
        }
    }

    async function contestarForm(event) {
        event.preventDefault();

        const labels = document.querySelectorAll('label');
        const campos = {};

        for (const label of labels) {
            const fieldId = label.getAttribute('for');
            const fieldText = label.innerText;
            const prompt = `En texto plano, genera una respuesta al siguiente campo: "${fieldText}" puede ser inventado, no importa si es correcto o no.`;

            try {
                campos[fieldId] = await obtenerRespuesta(prompt);
                console.log(`campos[${fieldId}]:`, campos[fieldId]);
                // llenar el campo del formulario con la respuesta generada
                document.getElementById(fieldId).value = campos[fieldId];
            } catch (error) {
                console.error("Error en la solicitud:\n", error);
            }
        }
    }

    const button = document.createElement('button');
    button.id = 'autoFillButton';
    button.innerText = 'Responder form';
    document.getElementsByName('formVentanilla').appendChild(button);

    document.getElementById('autoFillButton').addEventListener('click', contestarForm);
}

if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initialize);
} else {
initialize();
}