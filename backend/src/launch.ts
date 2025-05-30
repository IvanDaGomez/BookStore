import AWS from "aws-sdk"
import dotenv from "dotenv";
dotenv.config();
// Configura la región y las credenciales (o usa variables de entorno)
AWS.config.update({ region: 'sa-east-1' });

const ec2 = new AWS.EC2();

const instanceId = process.env.INSTANCE_ID_EC2;  // Cambia por tu ID real

if (!instanceId) {
  throw new Error("INSTANCE_ID_EC2 environment variable is not set.");
}

const params = {
  InstanceIds: [instanceId],
};

ec2.startInstances(params, (err, data) => {
  if (err) {
    console.error("Error al iniciar instancia:", err);
  } else {
    console.log("Instancia iniciada:", data.StartingInstances);
  }
});
