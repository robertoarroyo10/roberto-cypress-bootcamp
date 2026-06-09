# Notificaciones de Pipeline en Slack mediante Webhooks

Esta guía explica cómo crear un **Incoming Webhook** en Slack y usarlo desde un workflow de GitHub Actions para enviar notificaciones del estado del pipeline (éxito, fallo, etc.).

---

## 1. ¿Qué es un Incoming Webhook?

Un *Incoming Webhook* es una URL única que provee Slack y que permite publicar mensajes en un canal mediante una petición HTTP `POST`. No requiere autenticación con token: la URL **es** la credencial, por lo que debe guardarse como secreto.

---

## 2. Crear el Webhook en Slack

### Paso 1: Crear una app de Slack
1. Ve a https://api.slack.com/apps y pulsa **Create New App → From scratch**.
2. Asigna un nombre (ej. `CI Notifications`) y selecciona el workspace destino.

### Paso 2: Activar Incoming Webhooks
1. En el menú lateral, abre **Incoming Webhooks**.
2. Activa el toggle **Activate Incoming Webhooks → On**.
3. Pulsa **Add New Webhook to Workspace**.
4. Elige el canal donde quieres recibir las notificaciones (ej. `#qa-pipelines`).
5. Pulsa **Allow**.

### Paso 3: Copiar la URL
Slack te devolverá una URL del estilo:

```
https://hooks.slack.com/services/T000XXXX/B000YYYY/zzzzzzzzzzzzzzzzzzzz
```

> **NUNCA** la commitees en el repo. Es equivalente a una contraseña del canal.

---

## 3. Guardar el Webhook como Secret en GitHub

1. En tu repositorio: **Settings → Secrets and variables → Actions → New repository secret**.
2. Crea uno con un nombre claro, por ejemplo:  
   `PIPELINESLACKCONECTION`
3. Pega la URL del webhook como valor.
4. Guarda.

Ahora la referencia desde el YAML será:

```yaml
${{ secrets.PIPELINESLACKCONECTION }}
```

---

## 4. Probar el webhook desde terminal

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"Hola desde curl :wave:"}' \
  https://hooks.slack.com/services/XXX/YYY/ZZZ
```

Si todo funciona, verás el mensaje en el canal seleccionado.

---

## 5. Enviar notificación desde GitHub Actions

### Opción A: usando `curl` (sin dependencias extra)

Ejemplo basado en el workflow del repo:

```yaml
- name: Send notification to Slack
  if: failure()
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.PIPELINESLACKCONECTION }}
  run: |
    payload="payload={\"text\":\":x: Pipeline '${{ github.workflow }}' failed on branch '${{ github.ref }}' in repository '${{ github.repository }}'\"}"
    curl -X POST --data-urlencode "$payload" $SLACK_WEBHOOK_URL
```

#### Claves importantes
- `if: failure()` → solo se ejecuta si algún step anterior falló.
- También existen `if: success()`, `if: always()`, `if: cancelled()`.
- Las variables `github.workflow`, `github.ref`, `github.repository`, `github.actor` y `github.run_id` son muy útiles para enriquecer el mensaje.

### Opción B: notificar éxito y fallo

```yaml
- name: Notify success
  if: success()
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.PIPELINESLACKCONECTION }}
  run: |
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\":white_check_mark: Pipeline *${{ github.workflow }}* OK en \`${{ github.ref_name }}\` por ${{ github.actor }}\"}" \
      $SLACK_WEBHOOK_URL

- name: Notify failure
  if: failure()
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.PIPELINESLACKCONECTION }}
  run: |
    curl -X POST -H 'Content-type: application/json' \
      --data "{\"text\":\":x: Pipeline *${{ github.workflow }}* FALLÓ en \`${{ github.ref_name }}\`. Run: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}\"}" \
      $SLACK_WEBHOOK_URL
```

### Opción C: usando una Action del Marketplace

```yaml
- name: Slack Notification
  if: always()
  uses: slackapi/slack-github-action@v1.27.0
  with:
    payload: |
      {
        "text": "Pipeline ${{ github.workflow }} terminó con estado: ${{ job.status }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.PIPELINESLACKCONECTION }}
    SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

---

## 6. Formato avanzado del mensaje (Block Kit)

Slack soporta mensajes con bloques estructurados:

```json
{
  "blocks": [
    { "type": "header", "text": { "type": "plain_text", "text": ":x: Pipeline fallido" } },
    { "type": "section", "fields": [
        { "type": "mrkdwn", "text": "*Repo:*\nmi-repo" },
        { "type": "mrkdwn", "text": "*Rama:*\nmain" }
    ]},
    { "type": "actions", "elements": [
        { "type": "button", "text": { "type": "plain_text", "text": "Ver ejecución" },
          "url": "https://github.com/owner/repo/actions/runs/123" }
    ]}
  ]
}
```

Puedes prototipar mensajes en: https://app.slack.com/block-kit-builder

---

## 7. Buenas prácticas

- **Nunca** pongas la URL del webhook en el código ni en logs.
- Limita los pings: notifica fallos siempre, éxitos solo cuando aporten valor.
- Incluye enlace directo al run de GitHub Actions para depurar rápido.
- Usa emojis para distinguir visualmente éxito (`:white_check_mark:`) y fallo (`:x:`).
- Si manejas varios entornos, indica claramente la rama o el ambiente.
- Para escapar comillas, prefiere `--data-urlencode` o un archivo `payload.json` temporal en lugar de inline JSON con muchos escapes.

---

## 8. Troubleshooting

| Síntoma | Posible causa |
|---|---|
| `invalid_payload` | JSON mal formado o comillas mal escapadas. |
| `no_service` / `404` | Webhook revocado o URL mal copiada. |
| No llega el mensaje pero `curl` devuelve `ok` | El canal fue archivado o la app fue retirada. |
| El step nunca se ejecuta | Falta `if: always()`/`if: failure()` o el job se canceló antes. |

---

## Referencias
- Slack Incoming Webhooks: https://api.slack.com/messaging/webhooks
- Slack Block Kit Builder: https://app.slack.com/block-kit-builder
- GitHub Actions contexts (`github.*`): https://docs.github.com/actions/learn-github-actions/contexts
- Slack GitHub Action oficial: https://github.com/slackapi/slack-github-action
