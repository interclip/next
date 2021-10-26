FROM gitpod/workspace-mysql
RUN sudo apt update;
RUN sudo apt install redis-server -y;

USER root
# Install Krypton + kr (krypt.co)
RUN curl https://krypt.co/kr | sh \
	&& apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/*
