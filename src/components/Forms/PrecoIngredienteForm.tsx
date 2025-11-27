import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPreco, updatePreco } from "@/api/endpoints/precos";
import { useFetchInsumos } from "@/hooks/api/useFetchInsumos";
import { useFetchFornecedores } from "@/hooks/api/useFetchFornecedores";

const formSchema = z.object({
  ingredient_id: z.string().min(1, "Selecione um ingrediente"),
  supplier_id: z.string().min(1, "Selecione um fornecedor"),
  price: z.string().min(1, "Informe o preço"),
  purchase_unit_quantity: z.string().min(1, "Informe a quantidade"),
  purchase_unit: z.string().min(1, "Informe a unidade de compra"),
  valid_from: z.string().min(1, "Informe a data inicial"),
  valid_to: z.string().min(1, "Informe a data final"),
});

interface PrecoIngredienteFormProps {
  onSuccess: () => void;
  initialData?: any;
}

export function PrecoIngredienteForm({ onSuccess, initialData }: PrecoIngredienteFormProps) {
  const { toast } = useToast();
  const { fornecedores } = useFetchFornecedores(1);
  const { insumos } = useFetchInsumos(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ingredient_id: initialData.ingredient_id.toString(),
          supplier_id: initialData.supplier_id.toString(),
          price: initialData.price.toString(),
          purchase_unit_quantity: initialData.purchase_unit_quantity.toString(),
          purchase_unit: initialData.purchase_unit,
          valid_from: initialData.valid_from,
          valid_to: initialData.valid_to,
        }
      : {
          ingredient_id: "",
          supplier_id: "",
          price: "",
          purchase_unit_quantity: "",
          purchase_unit: "",
          valid_from: "",
          valid_to: "",
        },
  });

  const queryClient = useQueryClient();

  const mutationEdit = useMutation({
    mutationFn: updatePreco,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["precos"] });
      toast({
        title: "Preço atualizado!",
        description: "O preço foi atualizado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar preço",
        description: "Ocorreu um erro ao tentar atualizar o preço.",
        variant: "destructive",
      });
    },
  });

  const mutation = useMutation({
    mutationFn: createPreco,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["precos"] });
      toast({
        title: "Preço adicionado!",
        description: "O preço foi adicionado com sucesso ao estoque.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao adicionar preço",
        description: "Ocorreu um erro ao tentar adicionar o preço.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (initialData) {
      mutationEdit.mutate({
        ...values,
        id: initialData.id,
        supplier_id: parseInt(values.supplier_id),
        ingredient_id: parseInt(values.ingredient_id),
        price: parseFloat(values.price),
        purchase_unit_quantity: parseFloat(values.purchase_unit_quantity),
      });
    } else {
      mutation.mutate(values);
    }
    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ingredient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingrediente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover z-50">
                    {insumos.map((insumo: any) => (
                      <SelectItem key={insumo.id} value={insumo.id.toString()}>
                        {insumo.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover z-50">
                    {fornecedores.map((fornecedor: any) => (
                      <SelectItem key={fornecedor.id} value={fornecedor.id.toString()}>
                        {fornecedor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchase_unit_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purchase_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="kg">Quilograma (kg)</SelectItem>
                    <SelectItem value="g">Grama (g)</SelectItem>
                    <SelectItem value="L">Litro (L)</SelectItem>
                    <SelectItem value="ml">Mililitro (ml)</SelectItem>
                    <SelectItem value="un">Unidade (un)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valid_from"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido De</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valid_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido Até</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" className="w-full bg-gradient-primary">
            {initialData ? "Salvar Alterações" : "Adicionar Preço"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
