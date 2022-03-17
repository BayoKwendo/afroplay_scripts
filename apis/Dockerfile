FROM denoland/deno:1.19.3

EXPOSE 2028

WORKDIR /app

# Prefer not to run as root.
USER deno

# COPY ./deps.ts .

# RUN deno cache --unstable deps.ts

ADD . .

RUN deno cache --unstable server.ts

CMD [ "run", "--unstable", "--allow-net", "--allow-write", "--allow-env", "--allow-run", "--watch", "--allow-read", "server.ts" ]
