#!/bin/bash

# ------------------------
# CONFIGURATION
# ------------------------
MASTER_CONTAINER="mysql_master"
SLAVE1_CONTAINER="mysql_slave1"
SLAVE2_CONTAINER="mysql_slave2"

MASTER_USER="root"
MASTER_PASS="root"

REPL_USER="repl"
REPL_PASS="replpassword"

# ------------------------
# 1️⃣ Create replication user on master using mysql_native_password
# ------------------------
echo "Creating replication user on master with mysql_native_password..."
docker exec -i $MASTER_CONTAINER mysql -u$MASTER_USER -p$MASTER_PASS -e "
CREATE USER IF NOT EXISTS '$REPL_USER'@'%' IDENTIFIED WITH mysql_native_password BY '$REPL_PASS';
GRANT REPLICATION SLAVE ON *.* TO '$REPL_USER'@'%';
FLUSH PRIVILEGES;
"

# ------------------------
# 2️⃣ Get master status (binlog file & position)
# ------------------------
echo "Fetching master status..."
MASTER_STATUS=$(docker exec -i $MASTER_CONTAINER mysql -u$MASTER_USER -p$MASTER_PASS -e "SHOW MASTER STATUS\G")
BINLOG_FILE=$(echo "$MASTER_STATUS" | grep 'File:' | awk '{print $2}')
BINLOG_POS=$(echo "$MASTER_STATUS" | grep 'Position:' | awk '{print $2}')

echo "Master Binlog File: $BINLOG_FILE"
echo "Master Binlog Position: $BINLOG_POS"

# ------------------------
# 3️⃣ Configure slaves
# ------------------------
for SLAVE in $SLAVE1_CONTAINER $SLAVE2_CONTAINER; do
    echo "Configuring slave: $SLAVE"
    docker exec -i $SLAVE mysql -u$MASTER_USER -p$MASTER_PASS -e "
    STOP SLAVE;
    CHANGE MASTER TO
      MASTER_HOST='$MASTER_CONTAINER',
      MASTER_USER='$REPL_USER',
      MASTER_PASSWORD='$REPL_PASS',
      MASTER_LOG_FILE='$BINLOG_FILE',
      MASTER_LOG_POS=$BINLOG_POS;
    START SLAVE;
    "
done

# ------------------------
# 4️⃣ Verify slaves
# ------------------------
for SLAVE in $SLAVE1_CONTAINER $SLAVE2_CONTAINER; do
    echo "Checking slave status: $SLAVE"
    docker exec -i $SLAVE mysql -u$MASTER_USER -p$MASTER_PASS -e "SHOW SLAVE STATUS\G" | grep -E "Slave_IO_Running|Slave_SQL_Running"
done

echo "Replication setup complete!"
