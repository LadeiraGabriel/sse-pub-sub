import { Controller, Get, MessageEvent, Param, Sse } from '@nestjs/common';
import { PubSubService } from '../pub-sub/pub-sub.service';
import { finalize, Observable, Subject } from 'rxjs';
import { ReportProgressDTO } from './report-progress.dto';

const reportId = '0f52678c-9739-4012-aa35-d9a0ea3bb621';
let partIndex: number = 1;

const filesToGenerate: string[] = ['csv', 'xls', 'pdf', 'zip'];

@Controller('reports')
export class ReportController {
  constructor(private readonly pubSubService: PubSubService) {}

  // vou chamar essa rota e nela chamar o publisher
  @Get()
  addProgress(): string {
    if (partIndex > filesToGenerate.length) return `All files generated!`;

    const parCent = 100 / filesToGenerate.length;

    const p = parCent * partIndex;

    const positionToFile = partIndex;

    this.pubSubService.publish(`processReport:${reportId}`, { data: `${p}%` });
    partIndex++;

    return `${filesToGenerate[positionToFile - 1].toUpperCase()} file generated successfully.`;
  }

  // aqui subscribe
  @Sse(':reportId/sse')
  process(@Param() { reportId }: ReportProgressDTO): Observable<MessageEvent> {
    const sub = new Subject<MessageEvent>();

    this.pubSubService.subscribe(
      `processReport:${reportId}`,
      (data: string) => {
        sub.next({ data });
      },
    );

    return sub.asObservable().pipe(
      finalize(() => {
        this.pubSubService.unsubscribe(`processReport:${reportId}`);
      }),
    );
  }
}
