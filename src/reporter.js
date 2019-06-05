import got from 'got';
import { TracerGlobals } from './globals';

import { getAWSEnvironment, getTracerInfo } from './utils';

export const SPAN_PATH = 'api/spans';
export const LUMIGO_TRACER_EDGE = 'lumigo-tracer-edge.golumigo.com';

export const getAwsEdgeHost = () => {
  const { awsRegion } = getAWSEnvironment();
  return `${awsRegion}.${LUMIGO_TRACER_EDGE}`;
};

export const getEdgeHost = () => {
  const { edgeHost } = TracerGlobals.getTracerInputs();
  if (edgeHost) {
    return edgeHost;
  }
  const awsEdgeHost = getAwsEdgeHost();
  return awsEdgeHost;
};

export const getEdgeUrl = () => {
  const edgeHost = getEdgeHost();
  return `https://${edgeHost}/${SPAN_PATH}`;
};

export const sendSingleSpan = async span => sendSpans([span]);

export const sendSpans = async spans => {
  const { token } = spans[0];
  const { name, version } = getTracerInfo();
  const headers = {
    Authorization: token,
    'User-Agent': `${name}$${version}`,
    'Content-Type': 'application/json',
  };
  const edgeUrl = getEdgeUrl();
  const body = JSON.stringify(spans);
  await got.post(edgeUrl, { headers, body });
};