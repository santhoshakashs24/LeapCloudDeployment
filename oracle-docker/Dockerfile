# Use the official Oracle Linux base image
FROM oraclelinux:7-slim

# Set environment variables
ENV ORACLE_BASE=/opt/oracle
ENV ORACLE_HOME=$ORACLE_BASE/product/19c/dbhome_1
ENV ORACLE_SID=ORCLCDB
ENV PATH=$ORACLE_HOME/bin:$PATH

# Install necessary packages and setup Oracle user
RUN yum -y install oracle-database-preinstall-19c && \
    yum clean all && \
    mkdir -p $ORACLE_BASE && \
    chown -R oracle:oinstall $ORACLE_BASE

# Copy Oracle installation files
COPY oracle-database-ee-19c-1.0-1.x86_64.rpm /tmp/

# Install Oracle Database
RUN yum -y localinstall /tmp/oracle-database-ee-19c-1.0-1.x86_64.rpm && \
    rm -f /tmp/oracle-database-ee-19c-1.0-1.x86_64.rpm

# Expose the Oracle listener port
EXPOSE 1521

# Start Oracle Database
CMD ["/bin/bash", "-c", "source /etc/profile && /opt/oracle/product/19c/dbhome_1/bin/dbstart $ORACLE_HOME"]
