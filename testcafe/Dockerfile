FROM testcafe/testcafe

USER root
COPY . /var/src/test
WORKDIR /var/src/test
ENV TEST_HOST app
ENV PORT 3000
RUN set -x \
  && apk update \
  && apk add --no-cache yarn \
  && yarn
