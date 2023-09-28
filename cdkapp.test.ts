import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Cdkapp from '../lib/cdkapp-stack';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import * as sqs from 'aws-cdk-lib/aws-sqs';



const vpc = new ec2.Vpc(this, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.30.0.0/16')
});

const vpcConnector = new apprunner.CfnVpcConnector(this, 'VpcConnector', {
  vpc,
  vpcSubnets: vpc.selectSubnets({ subnetType: ec2.SubnetType.PUBLIC }),
  vpcConnectorName: 'MyVpcConnector',
});

new apprunner.CfnService(this, 'Service', {
  source: apprunner.Source.fromEcrPublic({
    imageConfiguration: { port: 8000 },
    imageIdentifier: 'public.ecr.aws/aws-containers/hello-app-runner:latest',
  }),
  vpcConnector,
});



export class CdkStarterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 create queue
    const queue = new sqs.Queue(this, 'sqs-queue');

    // 👇 create sns topic
    const topic = new sns.Topic(this, 'sns-topic');

    // 👇 subscribe queue to topic
    topic.addSubscription(new subs.SqsSubscription(queue));

    new cdk.CfnOutput(this, 'snsTopicArn', {
      value: topic.topicArn,
      description: 'The arn of the SNS topic',
    });
  }
}

i

const topic = new sns.Topic(this, 'MyTopic');

const topicRule = new iot.TopicRule(this, 'TopicRule', {
  sql: iot.IotSql.fromStringAsVer20160323(
    "SELECT topic(2) as device_id, year, month, day FROM 'device/+/data'",
  ),
  actions: [
    new actions.SnsTopicAction(topic, {
      messageFormat: actions.SnsActionMessageFormat.JSON, // optional property, default is SnsActionMessageFormat.RAW
    }),
  ],
});

const user = new iam.User(this, 'User');
const accessKey = new iam.AccessKey(this, 'AccessKey', { user });
declare const stack: Stack;

new secretsmanager.Secret(this, 'metrodb-secrets', {
  secretObjectValue: {
    username: SecretValue.unsafePlainText(user.userName),
    database: SecretValue.unsafePlainText('foo'),
    password: accessKey.secretAccessKey,
  },
})