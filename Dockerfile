FROM harbor.cloud2go.cn/pageplug/ubuntu-20.04:base

# Define volumes - Service Layer
VOLUME [ "/appsmith-stacks" ]

# ------------------------------------------------------------------------
# Add backend server - Application Layer
ARG JAR_FILE=./app/server/dist/server-*.jar
ARG PLUGIN_JARS=./app/server/dist/plugins/*.jar

ARG APPSMITH_CLOUD_SERVICES_BASE_URL
ENV APPSMITH_CLOUD_SERVICES_BASE_URL=${APPSMITH_CLOUD_SERVICES_BASE_URL}

ARG APPSMITH_SEGMENT_CE_KEY
ENV APPSMITH_SEGMENT_CE_KEY=${APPSMITH_SEGMENT_CE_KEY}
#Create the plugins directory
RUN mkdir -p ./backend ./editor ./rts ./backend/plugins ./templates ./utils

#Add the jar to the container
COPY ${JAR_FILE} backend/server.jar
COPY ${PLUGIN_JARS} backend/plugins/

# Add client UI - Application Layer
COPY ./app/client/build editor/

# Add RTS - Application Layer
COPY ./app/client/packages/rts/package.json ./app/client/packages/rts/dist rts/

# Nginx, MongoDB and PostgreSQL data config template - Configuration layer
COPY ./deploy/docker/templates/nginx/* \
  ./deploy/docker/templates/docker.env.sh \
  ./deploy/docker/templates/mockdb_postgres.sql \
  ./deploy/docker/templates/users_postgres.sql \
  ./deploy/docker/templates/appsmith_starting.html \
  ./deploy/docker/templates/appsmith_initializing.html \
  templates/

# Add bootstrapfile
COPY ./deploy/docker/entrypoint.sh ./deploy/docker/scripts/* info.*json ./

# Add util tools
COPY ./deploy/docker/utils ./utils
RUN cd ./utils && npm install --only=prod && npm install --only=prod -g .

# Add process config to be run by supervisord
COPY ./deploy/docker/templates/supervisord.conf /etc/supervisor/supervisord.conf
COPY ./deploy/docker/templates/supervisord/ templates/supervisord/

# Add defined cron job
COPY ./deploy/docker/templates/cron.d /etc/cron.d/
RUN chmod 0644 /etc/cron.d/*

RUN chmod +x entrypoint.sh renew-certificate.sh healthcheck.sh

# Disable setuid/setgid bits for the files inside container.
RUN find / \( -path /proc -prune \) -o \( \( -perm -2000 -o -perm -4000 \) -print -exec chmod -s '{}' + \) || true

# Update path to load appsmith utils tool as default
ENV PATH /opt/appsmith/utils/node_modules/.bin:$PATH
LABEL com.centurylinklabs.watchtower.lifecycle.pre-check=/watchtower-hooks/pre-check.sh
LABEL com.centurylinklabs.watchtower.lifecycle.pre-update=/watchtower-hooks/pre-update.sh
COPY ./deploy/docker/watchtower-hooks /watchtower-hooks
RUN chmod +x /watchtower-hooks/pre-check.sh
RUN chmod +x /watchtower-hooks/pre-update.sh


EXPOSE 80
EXPOSE 443
ENTRYPOINT [ "/opt/appsmith/entrypoint.sh" ]
HEALTHCHECK --interval=15s --timeout=15s --start-period=45s CMD "/opt/appsmith/healthcheck.sh"
CMD ["/usr/bin/supervisord", "-n"]
