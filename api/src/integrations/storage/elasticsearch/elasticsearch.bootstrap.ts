import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
    CONTACTS_INDEX,
    CONTACTS_MAPPING,
    LEADS_INDEX,
    LEADS_MAPPING,
} from './elasticsearch.constants';
import { ElasticsearchService } from './elasticsearch.service';

@Injectable()
export class ElasticsearchBootstrapService implements OnModuleInit {
    private readonly logger = new Logger(ElasticsearchBootstrapService.name);

    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async onModuleInit(): Promise<void> {
        if (!this.elasticsearchService.enabled) return;
        try {
            await this.elasticsearchService.ensureIndex(LEADS_INDEX, LEADS_MAPPING);
            await this.elasticsearchService.ensureIndex(CONTACTS_INDEX, CONTACTS_MAPPING);
        } catch (error) {
            this.logger.warn(
                `Elasticsearch unreachable at startup: ${this.errMsg(error)} — search features disabled`,
            );
        }
    }

    private errMsg(error: unknown): string {
        return error instanceof Error ? error.message : 'Unknown error';
    }
}
