FROM denoland/deno:1.18.0

EXPOSE 1204

WORKDIR /app

# Prefer not to run as root.
USER deno
# RUN deno cache --unstable deps.ts
ADD . .

RUN deno cache --unstable sms_server.ts

CMD [ "run", "--unstable", "--allow-net", "--allow-env", "--watch", "--allow-read", "--allow-write","sms_server.ts" ]
