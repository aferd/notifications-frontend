import { IntegrationExporterCsv } from '../Csv';
import { integrationExporterFactory } from '../Factory';
import { IntegrationExporterJson } from '../Json';
import { ExporterType } from '../../../insights-common-typescript';

describe('src/utils/exporters/Policy/Factory', () => {
  it('get CSV Exporter', () => {
    const exporter = integrationExporterFactory(ExporterType.CSV);
    expect(exporter).toEqual(new IntegrationExporterCsv());
  });

  it('get JSON Exporter', () => {
    const exporter = integrationExporterFactory(ExporterType.JSON);
    expect(exporter).toEqual(new IntegrationExporterJson());
  });

  it('Wrong type throws exception', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => integrationExporterFactory('foo' as any)).toThrow();
  });
});
