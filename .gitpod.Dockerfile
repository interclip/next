FROM gitpod/workspace-mysql
RUN sudo apt update;
RUN sudo apt install redis-server -y;